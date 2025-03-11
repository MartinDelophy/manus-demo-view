import asyncio
import websockets
import uuid
import random
import json
import logging
import ast
import requests
import re
from util import extract_business_info, extract_todo_list, extract_shell_txt, extract_python_txt, extract_json_txt
import subprocess
from main import thinker, actioner, actioner_analyze
# 配置日志记录
logging.basicConfig(level=logging.ERROR)

# 存储所有连接的客户端及其对应的任务信息
connected_clients = {}

# 生成唯一的任务 ID
def generate_task_id():
    return str(uuid.uuid4())

# 初始化任务信息
def initialize_task_info(task_name):
    task_id = generate_task_id()
    flow_text = thinker(task_name)
    analyze_text = actioner_analyze(flow_text)
    print("分析任务", analyze_text, flow_text)
    task = extract_json_txt(analyze_text)[0]

    task = json.loads(task)

    task.update({
        "id": 1,
        "status": "running"
    })
    return {
        "taskName": task_name,
        "taskId": task_id,
        "tasks": [task],
        "flowText": flow_text
    }


# 模拟任务执行，产生中间信息
async def run_task(websocket, task_info):
    print("进入子任务")
    flow_text = task_info["flowText"]
    flow_count = extract_todo_list(flow_text)
    task_name = task_info["taskName"]
    # 上下文内容
    context_content = f"用户给出的任务: {task_name}"
    print("流程任务数量", len(flow_count))
    for i in range(len(flow_count)):
        action_text = f"""
            {flow_text}
        """
        current_flow = flow_count[i]
        restTaskParam= {
            "id": i + 2,
            "status": "running"
        }
        # 如果最后一步，应该要输出一些文件信息，需要把上下文都拼接进入
        if i == len(flow_count) - 1:
            current_flow = f"""
                当前阶段需要做的任务，当前阶段为最后一步: {current_flow}
                前置阶段的内容信息整合: {context_content}
            """
            restTaskParam["status"] = "done"
        else:
            current_flow = f"""
                当前阶段需要做的任务：{current_flow}
                前置阶段的内容信息整合: {context_content}
            """
        flow_text = actioner(current_flow)
        print("流程内容输出: ", flow_text)
        analyze_text = actioner_analyze(flow_text)
        print("分析任务", analyze_text)
        analyze_info = extract_json_txt(analyze_text)[0]
        new_task = {}
        try:
            new_task = json.loads(analyze_info)
            # 如果 new_task["preview"]["preview"]["content"] 类型不是字符串，帮忙自动转化成字符串
            if not isinstance(new_task["preview"]["content"], str):
                new_task["preview"]["content"] = str(new_task["preview"]["content"])
        except json.JSONDecodeError as e:
            print("解析出错", e)
            new_task = {
                "text": current_flow,
                "command": "packaging source code...",
                "output": "Source code archived successfully",
                "preview": {
                    "type": "text",
                    "title": current_flow,
                    "description": context_content,
                    "content": f"解析出错，{e}"
                }
            }
        new_task.update(restTaskParam)
        task_info["tasks"].append(new_task)
        # print("任务打印输出", task_info)
        await websocket.send(json.dumps(task_info))
        print("流程内容输出: ", flow_text)
        shell_code = extract_shell_txt(flow_text)
        # 执行shell代码
        if len(shell_code) > 0:
            with open('./tmp/sandbox_code.sh', 'w') as f:
                f.write(shell_code[0])
            result = subprocess.run(['sh', './tmp/sandbox_code.sh'], capture_output=True, text=True, check=True)
        python_code = extract_python_txt(flow_text)
        if len(python_code) > 0:
            with open('./tmp/sandbox_code.py', 'w') as f:
                f.write(python_code[0])
        try:
            result = subprocess.run(['python3', './tmp/sandbox_code.py'], capture_output=True, text=True, check=True)
        except subprocess.CalledProcessError as e:
            result = e
        context_content += f"""
        {flow_count[i]}: 输出的内容 {result.stdout}
        """


async def handle_connection(websocket):
    try:
        # 接收客户端发送的任务标题
        queryInfo = await websocket.recv()
        try:
            queryInfo = json.loads(queryInfo)
        except json.JSONDecodeError as e:
            logging.error(f"Failed to decode JSON data from client: {e}")
            error_message = {"error": "Invalid JSON data received"}
            await websocket.send(json.dumps(error_message))
            return

        print(f"Received task name from client: {queryInfo}")

        # 初始化任务信息
        task_info = initialize_task_info(queryInfo['query'])
        connected_clients[websocket] = task_info

        # 发送任务信息给客户端
        try:
            await websocket.send(json.dumps(task_info))
        except Exception as e:
            logging.error(f"Failed to send task info to client: {e}")
            return

        # 启动任务执行协程
        task = asyncio.create_task(run_task(websocket, task_info))

        # 保持连接，持续监听客户端消息
        while True:
            try:
                message = await websocket.recv()
                # 这里可以根据需要处理客户端后续发送的消息
                print(f"Received additional message from client: {message}")
            except websockets.exceptions.ConnectionClosedOK:
                print("Client connection closed normally")
                task.cancel()  # 取消任务执行协程
                break
            except Exception as e:
                logging.error(f"Error receiving message from client: {e}")
                task.cancel()  # 取消任务执行协程
                break

    except websockets.exceptions.ConnectionClosedOK:
        print("Client connection closed")
    except Exception as e:
        logging.error(f"Unexpected error in handle_connection: {e}")
    finally:
        print("Connection closed")
        # 当连接关闭时，从集合中移除客户端
        if websocket in connected_clients:
            del connected_clients[websocket]

async def main():
    # 启动 WebSocket 服务器
    server = await websockets.serve(handle_connection, "localhost", 8765)
    print("WebSocket server started on ws://localhost:8765")

    # 保持服务器运行
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())