// 模拟API响应延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 模拟步骤数据
export interface Step {
  id: number
  text: string
  command: string
  output?: string
}

// 模拟生成的HTML预览
export const getPreviewHTML = async (query: string): Promise<string> => {
  await delay(500) // 模拟网络延迟

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Page</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      background: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
    }
    p {
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Generated Content</h1>
    <p>This is a preview of the generated HTML based on your query:</p>
    <blockquote>
      ${query}
    </blockquote>
    <p>The content will update as the generation progresses...</p>
  </div>
</body>
</html>
  `
}

// 模拟获取执行步骤
export const getExecutionSteps = async (): Promise<Step[]> => {
  await delay(300) // 模拟网络延迟

  return [
    {
      id: 1,
      text: "分析用户查询内容",
      command: "analyzing user query...",
      output: "Identified key requirements from user input",
    },
    {
      id: 2,
      text: "搜索相关资源",
      command: "searching resources...",
      output: "Found 5 relevant resources for the query",
    },
    {
      id: 3,
      text: "生成HTML结构",
      command: "generating HTML structure...",
      output: "Created base HTML with semantic elements",
    },
    {
      id: 4,
      text: "应用样式",
      command: "applying CSS styles...",
      output: "Applied responsive design patterns",
    },
    {
      id: 5,
      text: "添加交互功能",
      command: "adding JavaScript functionality...",
      output: "Implemented user interaction handlers",
    },
    {
      id: 6,
      text: "优化代码",
      command: "optimizing code...",
      output: "Minified resources and improved performance",
    },
    {
      id: 7,
      text: "完成生成",
      command: "generation complete!",
      output: "All tasks completed successfully",
    },
  ]
}

// 模拟保存结果
export const saveResult = async (html: string): Promise<{ success: boolean; message: string }> => {
  await delay(800) // 模拟网络延迟

  // 模拟成功响应
  return {
    success: true,
    message: "结果已成功保存",
  }
}

