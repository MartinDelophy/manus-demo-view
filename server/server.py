import asyncio
import websockets
import uuid
import json
import logging
from main import thinker, actioner, actioner_analyze
from util import extract_todo_list, extract_shell_txt, extract_python_txt, execute_command
import subprocess

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
connected_clients = {}

def generate_task_id():
    return str(uuid.uuid4())

def initialize_task_info(websocket, task_name):
    global connected_clients
    try:
        flow_text = thinker(task_name)
        if not flow_text:
            raise ValueError("OpenRouter响应为空")
        analyze_data = actioner_analyze(flow_text)
        if not analyze_data:
            raise ValueError("任务分析失败")
        
        # 添加全局ID和状态
        analyze_data["id"] = 1
        task_id = generate_task_id()
        analyze_data["status"] = "running"
        # 链接池添加任务
        connected_clients[task_id] = {
            "task_id": task_id,
            "id": analyze_data["id"],
            "status": analyze_data["status"]
        }
        task_info = {
            "taskName": task_name,
            "taskId": task_id,
            "tasks": [analyze_data],
            "flow_text": flow_text
        }
        await safe_send(websocket, task_info)
        return task_info
    except Exception as e:
        logger.error(f"初始化失败: {str(e)}")
        return {"error": str(e)}

async def safe_send(websocket, data):
    logger.info(f"发送数据: {data}")
    """安全发送数据"""
    try:
        await websocket.send(json.dumps(data, ensure_ascii=False))
    except websockets.exceptions.ConnectionClosed:
        logger.warning("连接已关闭，发送失败")

async def run_task(websocket, task_info):
    global connected_clients
    try:
        flow_text = task_info["flow_text"]
        steps = extract_todo_list(flow_text)
        context = []
        
        for step_idx, step in enumerate(steps):
            # 更新任务状态
            task_info["tasks"][0]["status"] = "running"
            # 任务ID自增
            task_info["tasks"][0]["id"] += 1 
            await safe_send(websocket, task_info)
            
            # 执行当前步骤
            response = await asyncio.to_thread(actioner, step)
            
            # todo: 上报任务执行过程
            def report():
                pass
            
            # 处理代码执行
            if shell_code := extract_shell_txt(response):
                if len(shell_code) > 0:
                    with open('./tmp/sandbox_code.sh', 'w') as f:
                        f.write(shell_code[0])
                    execute_command(["sh", "./tmp/sandbox_code.sh"], report)
                
            if python_code := extract_python_txt(response):
                if len(python_code) > 0:
                    with open('./tmp/sandbox_code.py', 'w') as f:
                        f.write(python_code[0])
                result = subprocess.run(['python', './tmp/sandbox_code.py'], capture_output=True, text=True, check=True)
            
            # 更新上下文
            context.append(response)
        
        # 标记任务完成
        task_info["tasks"][0]["status"] = "completed"
        # 删除链接池中的任务
        del connected_clients[task_info["taskId"]]
        await safe_send(websocket, task_info)
        
    except Exception as e:
        logger.error(f"任务执行失败: {str(e)}")
        task_info["tasks"][0]["status"] = "error"
        await safe_send(websocket, task_info)

async def handle_connection(websocket):
    try:
        # 协议校验
        if websocket.request.headers.get('Sec-WebSocket-Version', '') != '13':
            await websocket.close(code=4000, reason='不支持的协议版本')
            return

        # 保持连接，持续监听客户端消息
        while True:
            try:
                message = await websocket.recv()
                task_info = initialize_task_info(websocket, json.loads(message)["query"])
                # 启动任务执行协程
                await run_task(websocket, task_info)
                # 这里可以根据需要处理客户端后续发送的消息
                print(f"Received message from client: {message}")
            except websockets.exceptions.ConnectionClosedOK:
                print("Client connection closed normally")
                break
            except Exception as e:
                logging.error(f"Error receiving message from client: {e}")
                break
        
    except websockets.exceptions.ConnectionClosedOK:
        logger.info("客户端正常断开连接")
    except Exception as e:
        logger.error(f"连接错误: {str(e)}")
    finally:
        await websocket.close()

async def main():
    async with websockets.serve(
        handle_connection,
        "localhost",
        8765,
        ping_interval=20,
        max_size=10*1024*1024  # 10MB最大消息
    ):
        logger.info("WebSocket服务已启动: ws://localhost:8765")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())