import json
import re
import requests
import yaml
import os
import logging
from dotenv import load_dotenv
from util import extract_business_info

# 初始化环境变量
load_dotenv()

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 加载配置
with open('./example.yml', 'r') as f:
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

def _clean_response(text):
    """清洗响应内容"""
    text = re.sub(r'```json\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\s*```', '', text)
    text = re.sub(r'[\x00-\x09\x0B-\x1F\x7F]', '', text)
    return text.strip()

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

def thinker(task_name):
    """生成任务流程文本"""
    try:
        common_params["messages"] = [
            {"role": "system", "content": flow_txt},
            {"role": "user", "content": task_name}
        ]
        
        response = requests.post(
            config_data["server"]["url"],
            headers=headers,
            json=common_params,
            timeout=30
        )
        
        if response.ok:
            raw_text = response.json()['choices'][0]['message']['content']
            return _clean_response(raw_text)
        else:
            logger.error("Thinker请求失败")
            return None
    except Exception as e:
        logger.error(f"Thinker错误: {str(e)}")
        return None

def actioner(step):
    """执行单个步骤"""
    try:
        common_params["messages"] = [
            {"role": "system", "content": actioner_txt},
            {"role": "user", "content": step}
        ]
        
        response = requests.post(
            config_data["server"]["url"],
            headers=headers,
            json=common_params,
            timeout=30
        )
        
        if response.ok:
            raw_text = response.json()['choices'][0]['message']['content']
            return _clean_response(raw_text)
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
        
        response = requests.post(
            config_data["server"]["url"],
            headers=headers,
            json=common_params,
            timeout=30
        )
        
        if not response.ok:
            return None
            
        raw_text = response.json()['choices'][0]['message']['content']
        cleaned_text = _clean_response(raw_text)
        
        try:
            raw_data = json.loads(cleaned_text)
            return parse_task_data(raw_data)
        except json.JSONDecodeError:
            return None
            
    except Exception as e:
        logger.error(f"分析失败: {str(e)}")
        return None