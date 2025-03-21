import re
import os

def extract_html_blocks(markdown_text):
    # 正则表达式匹配 ```html ``` 代码块
    pattern = r'```html(.*?)```'
    # 使用 re.DOTALL 标志使 . 匹配包括换行符在内的所有字符
    matches = re.findall(pattern, markdown_text, re.DOTALL)
    
    # 去除每个匹配项的前后空白字符
    return [match.strip() for match in matches]

# 提取 JSON 代码块
def extract_json_txt(markdown_text):
    # 正则表达式匹配 ```json ``` 代码块
    pattern = r'```json(.*?)```'
    # 使用 re.DOTALL 标志使 . 匹配包括换行符在内的所有字符
    matches = re.findall(pattern, markdown_text, re.DOTALL)
    
    # 去除每个匹配项的前后空白字符
    return [match.strip() for match in matches]


# 提取 业务模版信息
def extract_business_info(markdown_path):
    content = ''
    with open(f'{markdown_path}', 'r', encoding='utf-8') as file:
        content = file.read()
    return content

# 提取todo List 中 包含 ( ) 的个数
def extract_todo_list(markdown_text):
    # 正则表达式匹配 - ( ) 任务清单
    pattern = r'- \([ xX]\) (.*?)\n'
    matches = re.findall(pattern, markdown_text)
    return matches

# 提取  shell 代码块
def extract_shell_txt(markdown_text):
    # 正则表达式匹配 ```shell ``` 代码块
    pattern = r'```shell(.*?)```'
    # 使用 re.DOTALL 标志使 . 匹配包括换行符在内的所有字符
    matches = re.findall(pattern, markdown_text, re.DOTALL)
    
    # 去除每个匹配项的前后空白字符
    return [match.strip() for match in matches]

# 提取 python 代码块
def extract_python_txt(markdown_text):
    # 正则表达式匹配 ```python ``` 代码块
    pattern = r'```python(.*?)```'
    # 使用 re.DOTALL 标志使 . 匹配包括换行符在内的所有字符
    matches = re.findall(pattern, markdown_text, re.DOTALL)
    
    # 去除每个匹配项的前后空白字符
    return [match.strip() for match in matches]

# 传入python代码块，执行代码块
def run_python_code(python_code):
    exec(python_code)
    
    
# 扫描plugin目录下的所有层级下一层级的markdown文件,将内容\n拼接成一个字符串
def scan_markdown_files():
    # 扫描 plugin 目录下的所有文件
    markdown_files = []
    for root, dirs, files in os.walk("./plugins"):
        for file in files:
            if file.endswith(".md"):
                markdown_files.append(os.path.join(root, file))
    # 读取所有 markdown 文件的内容
    markdown_content = ""
    for file in markdown_files:
        with open(file, 'r', encoding='utf-8') as f:
            markdown_content += f.read() + "\n"
    return markdown_content


# 处理模型请求参数
def process_request_params(request_params, modal_type):
    return request_params


# 处理模型响应结果
def process_response_result(response_result, model_type):
    print("response_result: ", response_result, model_type)
    if model_type == "ollama":
        return response_result["message"]["content"]
    elif model_type == "deepseek":
        return response_result['choices'][0]['message']['content']