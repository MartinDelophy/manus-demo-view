import re

txt = """```markdown
    # 任务清单
    - ( ) 研究卡西欧手表的主要特点和卖点
    - ( ) 收集用户对于卡西欧手表的评价和反馈
    - ( ) 确定文案的目标受众和传播平台
    - ( ) 写下引人入胜的开头，吸引读者的注意
    - ( ) 列出卡西欧手表的功能与特点
    - ( ) 结合实际例子说明卡西欧手表的优势
    - ( ) 增加情感共鸣，引发读者购买欲
    - ( ) 添加图片或者视频链接，增加文案的视觉吸引力
    - ( ) 检查并完善文案，让文字流畅自然
    - ( ) 生成最终文案作为txt文件
```
"""


# 提取todo List 中 包含 ( ) 的个数
def extract_todo_list(markdown_text):
    # 正则表达式匹配 - ( ) 任务清单
    pattern = r'- \([ xX]\) (.*?)\n'
    matches = re.findall(pattern, markdown_text)
    return matches


print(extract_todo_list(txt))