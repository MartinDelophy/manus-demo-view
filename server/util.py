import re

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