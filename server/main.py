import ast
import requests
import re
from util import extract_business_info, extract_todo_list, extract_shell_txt, extract_python_txt, scan_markdown_files
import subprocess
import yaml

yaml_file = './example.yml'
with open(yaml_file, 'r') as file:
    config_data = yaml.safe_load(file)
common_params = {
    "model": config_data["server"]["model"] ,
    "stream": False
}

headers = {
}

request_path = config_data["server"]["url"]


flow_txt = extract_business_info("./prompts/step_prompt.md")

actioner_txt = extract_business_info("./prompts/actioner_prompt.md")

actioner_analyze_txt = extract_business_info("./prompts/analyze_prompt.md")

scan_tools_md = scan_markdown_files()

# thinker 我认为就是一个思考者，思考者的作用就是根据用户的输入，来进行思考，然后给出一个回答
def thinker(user_text):
    system_txt = flow_txt
    user_text = user_text
    common_params["messages"] = [
        {
            "role": "system",
            "content": system_txt
        },
        {
            "role": "user",
            "content": user_text
        }
    ]
    response = requests.post(request_path, json=common_params, headers=headers)
    response = response.json()
    print("think result",response)
    return response["message"]["content"]


# actioner 我认为是任务的执行者，根据用户的输入，来执行任务，然后给出一个回答
def actioner(user_text):
    system_txt = f"""
    您可以支配的命令有：
    {scan_tools_md}
    {actioner_txt}
    """ 
    user_text = user_text
    common_params["messages"] = [
        {
            "role": "system",
            "content": system_txt
        },
        {
            "role": "user",
            "content": user_text
        }
    ]
    
    response = requests.post(request_path, json=common_params, headers=headers)
    response = response.json()
    return response["message"]["content"]


# actioner 我认为是任务的执行者，根据用户的输入，来执行任务，然后给出一个回答
def actioner_analyze(user_text):
    system_txt = actioner_analyze_txt
    user_text = user_text
    common_params["messages"] = [
        {
            "role": "system",
            "content": system_txt
        },
        {
            "role": "user",
            "content": user_text
        }
    ]
    
    response = requests.post(request_path, json=common_params, headers=headers)
    response = response.json()
    return response["message"]["content"]


# user_text = f"""
#     帮我设计一款五子棋游戏，可以让人与ai对战
# """

# flow_text = thinker(user_text)


# print("流程内容输出: ", flow_text)

# flow_count = extract_todo_list(flow_text)

# print("流程数量: ", flow_count)
# # 上下文内容
# context_content = ""


# for i in range(len(flow_count)):
#     action_text = f"""
#         {flow_txt}
#     """
#     current_flow = flow_count[i]
#     # 如果最后一步，应该要输出一些文件信息，需要把上下文都拼接进入
#     if i == len(flow_count) - 1:
#         current_flow = f"""
#             你需要基于上述信息整合：{current_flow}
#             收集到的内容信息: {context_content}
#         """
#     flow_text = actioner(current_flow)
#     print("流程内容输出: ", flow_text)
#     shell_code = extract_shell_txt(flow_text)
#     # 执行shell代码
#     if len(shell_code) > 0:
#         with open('./tmp/sandbox_code.sh', 'w') as f:
#             f.write(shell_code[0])
#         result = subprocess.run(['sh', './tmp/sandbox_code.sh'], capture_output=True, text=True, check=True)
#     python_code = extract_python_txt(flow_text)
#     if len(python_code) > 0:
#         with open('./tmp/sandbox_code.py', 'w') as f:
#             f.write(python_code[0])
#     result = subprocess.run(['python3', './tmp/sandbox_code.py'], capture_output=True, text=True, check=True)
#     output_txt = result.stdout
#     context_content += output_txt


# print(actioner("今天上海天气如何？"))