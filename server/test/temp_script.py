import os

code = """
import os
path = './test.txt'
print(f"当前工作目录: {os.getcwd()}")
print(f"文件将被写入到: {path}")
try:
    with open(path, 'w') as f:
        f.write('Hello, World!')
    print("文件写入成功")
except Exception as e:
    print(f"文件写入失败: {e}")
"""

try:
    exec(code)
except Exception as e:
    print(f"执行代码时出错: {e}")