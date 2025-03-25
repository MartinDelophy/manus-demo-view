import json
import re
import subprocess
import requests
import yaml
import os
import logging
from dotenv import load_dotenv
from util import extract_business_info, extract_todo_list, extract_shell_txt, extract_python_txt, scan_markdown_files, process_request_params, process_response_result, extract_json_txt


# 初始化环境变量
load_dotenv()

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 加载配置
with open('./env.yml', 'r') as f:
    config_data = yaml.safe_load(f)

# 请求参数配置
common_params = {
    "model": config_data["server"]["model"],
    "stream": False,
    "temperature": 0.7,
    "max_tokens": 1000,
    "response_format": {"type": "json_object"}
}

# 请求头配置
headers = {
    "Authorization": f"Bearer {os.getenv('OPENROUTER_KEY', config_data['server'].get('key', '')).strip()}",
    "Content-Type": "application/json",
    "HTTP-Referer": "https://github.com/your-project",
    "X-Title": "AI Workflow System"
}

# 读取提示文件
flow_txt = extract_business_info("./prompts/step_prompt.md")
actioner_txt = extract_business_info("./prompts/actioner_prompt.md")
actioner_analyze_txt = extract_business_info("./prompts/analyze_prompt.md")

scan_tools_md = scan_markdown_files()


def parse_task_data(raw_data):
    """转换任务数据结构"""
    return {
        "id": raw_data.get("id", 1),
        "text": raw_data["text"],
        "command": raw_data["command"],
        "output": raw_data.get("output", ""),
        "status": raw_data.get("status", "running"),
        "preview": {
            "type": raw_data["preview"]["type"],
            "title": raw_data["preview"]["title"],
            "description": raw_data["preview"].get("description", ""),
            "content": raw_data["preview"].get("content", ""),
            "fileName": raw_data["preview"].get("fileName"),
            "fileType": raw_data["preview"].get("fileType")
        }
    }

# thinker 我认为就是一个思考者，思考者的作用就是根据用户的输入，来进行思考，然后给出一个回答
def thinker(task_name):
    """生成任务流程文本"""
    try:
        common_params["messages"] = [
            {"role": "system", "content": flow_txt},
            {"role": "user", "content": task_name}
        ]
        process_request_params(common_params, config_data["server"]["model_type"])
        
        response = requests.post(
            config_data["server"]["url"],
            headers=headers,
            json=common_params,
            timeout=None
        )
        if response.ok:
            raw_text = process_response_result(response.json(), config_data["server"]["model_type"]) 
            print(f"Thinker响应: {raw_text}")
            return raw_text
        else:
            logger.error("Thinker请求失败")
            return None
    except Exception as e:
        logger.error(f"Thinker错误: {str(e)}")
        return None

# actioner 我认为是任务的执行者，根据用户的输入，来执行任务，然后给出一个回答
def actioner(user_text):
    system_txt = f"""
            {actioner_txt}
            ########################################
            您可以使用的工具规范如下：
             {scan_tools_md}
             """
    try:
        common_params["messages"] = [
            {"role": "system", "content": system_txt},
            {"role": "user", "content": user_text}
        ]
        process_request_params(common_params, config_data["server"]["model_type"])
        response = requests.post(
            config_data["server"]["url"],
            headers=headers,
            json=common_params,
            timeout=None
        )
        
        if response.ok:
            raw_text = process_response_result(response.json(), config_data["server"]["model_type"])
            logger.info(f"Actioner响应: {raw_text}")
            return raw_text
        else:
            logger.error("Actioner请求失败")
            return None
    except Exception as e:
        logger.error(f"Actioner错误: {str(e)}")
        return None

def actioner_analyze(user_text):
    try:
        common_params["messages"] = [
            {"role": "system", "content": actioner_analyze_txt},
            {"role": "user", "content": user_text}
        ]
        process_request_params(common_params, config_data["server"]["model_type"])
        response = requests.post(
            config_data["server"]["url"],
            headers=headers,
            json=common_params,
            timeout=None
        )
        
        if not response.ok:
            return None
            
        raw_text = process_response_result(response.json(), config_data["server"]["model_type"])
        cleaned_text = extract_json_txt(raw_text)[0]
        try:
            raw_data = json.loads(cleaned_text)
            return parse_task_data(raw_data)
        except json.JSONDecodeError:
            return None
            
    except Exception as e:
        logger.error(f"分析失败: {str(e)}")
        return None
