// WebSocket事件类型
export type WebSocketEvent =
  | { type: "CONNECT" }
  | { type: "DISCONNECT" }
  | { type: "STEP_UPDATE"; step: ExecutionStep }
  | { type: "EXECUTION_COMPLETE" }
  | { type: "PREVIEW_UPDATE"; html: string }
  | { type: "ERROR"; message: string };

// 执行步骤类型
export interface ExecutionStep {
  id: number;
  text: string;
  command: string;
  output?: string;
  status: "pending" | "running" | "completed" | "error";
  preview?: {
    type: "text" | "code" | "terminal" | "image" | "markdown" | "file";
    title: string;
    description?: string;
    content: string;
    language?: string;
    fileName?: string;
    fileType?: string;
  };
}

// WebSocket连接状态
export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting";

// WebSocket配置
export interface WebSocketConfig {
  url: string;
  useMock: boolean;
}

// 默认配置
const DEFAULT_CONFIG: WebSocketConfig = {
  url: "ws://localhost:8765",
  useMock: false,
};

// 更新 mockSteps 数组，添加文件预览示例
const mockSteps: ExecutionStep[] = [
  {
    id: 1,
    text: "分析用户查询内容",
    command: "analyzing user query...",
    output: "Identified key requirements from user input",
    status: "pending",
    preview: {
      type: "text",
      title: "查询分析",
      description: "分析用户输入的查询内容，提取关键信息和需求",
      content: `正在分析用户查询: 

用户查询内容已接收，开始进行语义分析和意图识别。
      
关键词提取:
- 界面设计
- 输入框
- 预览窗口
- 执行过程

识别到的主要需求:
1. 创建一个带有输入框的初始界面
2. 创建一个分屏显示的结果界面
3. 左侧需要显示执行过程
4. 右侧需要实时预览效果

分析完成，准备进行下一步操作。`,
    },
  },
  {
    id: 2,
    text: "搜索相关资源",
    command: "searching resources...",
    output: "Found 5 relevant resources for the query",
    status: "pending",
    preview: {
      type: "markdown",
      title: "资源搜索结果",
      description: "搜索与用户需求相关的资源和参考材料",
      content: `# 搜索结果

## 找到的相关资源

| 资源名称 | 类型 | 相关度 | 链接 |
|---------|------|-------|------|
| React Split Pane | 组件库 | 高 | [链接](https://github.com/tomkp/react-split-pane) |
| Tailwind CSS | 样式框架 | 高 | [链接](https://tailwindcss.com/) |
| Next.js App Router | 文档 | 中 | [链接](https://nextjs.org/docs) |
| Terminal UI Components | 示例 | 高 | [链接](#) |
| WebSocket实时通信 | 教程 | 中 | [链接](#) |

## 推荐组件

- **shadcn/ui**: 高质量UI组件库
- **Lucide React**: 图标库
- **React Syntax Highlighter**: 代码高亮
- **React Markdown**: Markdown渲染

## 设计参考

以下是一些可以参考的设计风格:

- 暗色主题界面
- 终端风格的输出区域
- 分屏布局
- 实时预览窗口

这些资源将帮助我们构建符合要求的界面。`,
    },
  },
  {
    id: 3,
    text: "生成HTML结构",
    command: "generating HTML structure...",
    output: "Created base HTML with semantic elements",
    status: "pending",
    preview: {
      type: "code",
      title: "HTML结构设计",
      description: "为应用程序生成基础HTML结构",
      content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Assistant</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-zinc-950 text-white">
  <header class="bg-zinc-900 border-b border-zinc-800 p-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="text-white font-bold text-xl">AI Assistant</div>
      <button class="px-4 py-2 border border-zinc-700 rounded-md">
        保存结果
      </button>
    </div>
  </header>

  <main class="flex h-[calc(100vh-4rem)]">
    <!-- 左侧执行面板 -->
    <div class="w-1/2 border-r border-zinc-800 flex flex-col">
      <div class="p-4 border-b border-zinc-800">
        <h2 class="font-medium">用户查询</h2>
        <p class="mt-2 text-zinc-400">用户输入的查询内容</p>
      </div>
      
      <div class="flex-1 overflow-auto p-4">
        <!-- 执行步骤将在这里动态生成 -->
      </div>
      
      <div class="p-3 border-t border-zinc-800 flex justify-center gap-2">
        <!-- 控制按钮 -->
      </div>
    </div>
    
    <!-- 右侧预览面板 -->
    <div class="w-1/2 flex flex-col">
      <!-- 预览内容将在这里动态生成 -->
    </div>
  </main>

  <script src="app.js"></script>
</body>
</html>`,
      language: "html",
    },
  },
  {
    id: 4,
    text: "应用样式",
    command: "applying CSS styles...",
    output: "Applied responsive design patterns",
    status: "pending",
    preview: {
      type: "code",
      title: "CSS样式设计",
      description: "为应用程序添加样式和响应式设计",
      content: `/* 全局样式 */
:root {
  --background: #09090b;
  --foreground: #ffffff;
  --border: #27272a;
  --primary: #18181b;
  --primary-foreground: #ffffff;
  --secondary: #27272a;
  --muted: #3f3f46;
  --muted-foreground: #a1a1aa;
  --accent: #18181b;
  --accent-foreground: #ffffff;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
    'Helvetica Neue', Arial, sans-serif;
  background-color: var(--background);
  color: var(--foreground);
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}

/* 头部样式 */
header {
  background-color: var(--primary);
  border-bottom: 1px solid var(--border);
  padding: 1rem;
}

/* 主内容区样式 */
main {
  display: flex;
  height: calc(100vh - 4rem);
}

/* 左侧面板 */
.execution-panel {
  width: 50%;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
}

/* 步骤样式 */
.step {
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  margin-bottom: 1rem;
}

.step.active {
  border-left: 2px solid #3b82f6;
}

.step.completed {
  border-color: var(--border);
}

/* 终端输出样式 */
.terminal {
  background-color: #000;
  border-radius: 0.375rem;
  padding: 0.5rem;
  font-family: monospace;
  margin-top: 0.5rem;
}

.terminal .command {
  color: #10b981;
}

.terminal .output {
  color: #d4d4d8;
  padding-left: 0.5rem;
  border-left: 2px solid var(--border);
  margin-top: 0.25rem;
}

/* 右侧预览面板 */
.preview-panel {
  width: 50%;
  display: flex;
  flex-direction: column;
}

.preview-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  background-color: var(--primary);
}

.preview-content {
  flex: 1;
  overflow: auto;
  padding: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  main {
    flex-direction: column;
  }
  
  .execution-panel,
  .preview-panel {
    width: 100%;
    height: 50%;
  }
  
  .execution-panel {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}`,
      language: "css",
    },
  },
  {
    id: 5,
    text: "添加交互功能",
    command: "adding JavaScript functionality...",
    output: "Implemented user interaction handlers",
    status: "pending",
    preview: {
      type: "code",
      title: "JavaScript交互功能",
      description: "实现用户界面的交互功能和WebSocket通信",
      content: `// WebSocket连接管理
class WebSocketManager {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.status = 'disconnected';
  }
  
  connect() {
    if (this.socket && (this.status === 'connected' || this.status === 'connecting')) {
      return;
    }
    
    this.status = 'connecting';
    this.socket = new WebSocket(this.url);
    
    this.socket.onopen = () => {
      this.status = 'connected';
      this.reconnectAttempts = 0;
      this.emit('open', {});
      console.log('WebSocket connected');
    };
    
    this.socket.onclose = () => {
      this.status = 'disconnected';
      this.emit('close', {});
      this.attemptReconnect();
      console.log('WebSocket disconnected');
    };
    
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };
    
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.emit('message', data);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
  
  send(data) {
    if (this.socket && this.status === 'connected') {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('Cannot send message, socket not connected');
    }
  }
  
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }
  
  off(event, callback) {
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }
  
  emit(event, data) {
    if (!this.listeners.has(event)) return;
    
    this.listeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(\`Error in \${event} listener:\`, error);
      }
    });
  }
  
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(\`Attempting to reconnect (\${this.reconnectAttempts}/\${this.maxReconnectAttempts}) in \${delay}ms\`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }
}

// 使用示例
const ws = new WebSocketManager('wss://api.example.com/ws');

ws.on('open', () => {
  console.log('Connection established');
});

ws.on('message', (data) => {
  if (data.type === 'STEP_UPDATE') {
    updateStep(data.step);
  } else if (data.type === 'PREVIEW_UPDATE') {
    updatePreview(data.content);
  }
});

ws.connect();

// UI更新函数
function updateStep(step) {
  // 更新步骤UI
}

function updatePreview(content) {
  // 更新预览UI
}

// 控制按钮事件处理
document.getElementById('play-button').addEventListener('click', () => {
  ws.send({ type: 'CONTROL', action: 'PLAY' });
});

document.getElementById('pause-button').addEventListener('click', () => {
  ws.send({ type: 'CONTROL', action: 'PAUSE' });
});

document.getElementById('reset-button').addEventListener('click', () => {
  ws.send({ type: 'CONTROL', action: 'RESET' });
});`,
      language: "javascript",
    },
  },
  {
    id: 6,
    text: "优化代码",
    command: "optimizing code...",
    output: "Minified resources and improved performance",
    status: "pending",
    preview: {
      type: "terminal",
      title: "代码优化过程",
      description: "优化代码以提高性能和用户体验",
      content: `$ npm run build

> ai-assistant@0.1.0 build
> next build

- info Loaded env from .env
- info Creating an optimized production build...
- info Compiled successfully
- info Linting and checking validity of types...
- info Collecting page data...
- info Generating static pages (0/8)
- info Generating static pages (8/8)
- info Finalizing page optimization...

Route (app)                              Size     First Load JS
┌ ○ /                                    5.31 kB        87.9 kB
├ ○ /_not-found                          0 B            82.6 kB
├ λ /api/mock                            0 B            82.6 kB
└ λ /result                              21.8 kB         109 kB
+ First Load JS shared by all            82.6 kB
  ├ chunks/938-d45c95c6c308b8b1.js       26.8 kB
  ├ chunks/fd9d1056-9a3b6e6df8c2608d.js  53.9 kB
  └ other shared chunks                  1.85 kB

λ  (Server)  server-side renders at runtime (uses getInitialProps or getServerSideProps)
○  (Static)  automatically rendered as static HTML (uses no initial props)

$ npm run analyze

> ai-assistant@0.1.0 analyze
> cross-env ANALYZE=true next build

- info Creating an optimized production build...
- info Compiled successfully
- info Linting and checking validity of types...

Bundles optimized successfully:
- Reduced main bundle size by 24.6%
- Implemented code splitting for dynamic imports
- Optimized image loading with next/image
- Reduced unused CSS by 18.2%
- Implemented tree shaking for unused code

Performance improvements:
- First Contentful Paint: 1.2s -> 0.8s
- Time to Interactive: 2.8s -> 1.9s
- Lighthouse Performance Score: 76 -> 92`,
      language: "bash",
    },
  },
  {
    id: 7,
    text: "完成生成",
    command: "generation complete!",
    output: "All tasks completed successfully",
    status: "pending",
    preview: {
      type: "image",
      title: "最终效果预览",
      description: "应用程序的最终效果预览",
      content:
        "/placeholder.svg?height=600&width=800&text=AI+Assistant+Final+Preview",
    },
  },
  // 添加文件预览示例
  {
    id: 8,
    text: "导出项目文档",
    command: "exporting documentation...",
    output: "Documentation files generated successfully",
    status: "pending",
    preview: {
      type: "file",
      title: "项目文档",
      description: "项目说明文档和使用指南",
      content: "",
      fileName: "AI-Assistant-Documentation.docx",
      fileType: "docx",
    },
  },
  {
    id: 9,
    text: "生成数据报表",
    command: "generating reports...",
    output: "Performance reports generated",
    status: "pending",
    preview: {
      type: "file",
      title: "性能分析报表",
      description: "应用程序性能分析和优化建议",
      content: "",
      fileName: "performance-analysis-2023.xlsx",
      fileType: "xlsx",
    },
  },
  {
    id: 10,
    text: "准备演示文稿",
    command: "preparing presentation...",
    output: "Presentation slides created",
    status: "pending",
    preview: {
      type: "file",
      title: "项目演示文稿",
      description: "用于项目展示和演示的幻灯片",
      content: "",
      fileName: "AI-Assistant-Presentation.pptx",
      fileType: "pptx",
    },
  },
  {
    id: 11,
    text: "打包源代码",
    command: "packaging source code...",
    output: "Source code archived successfully",
    status: "pending",
    preview: {
      type: "file",
      title: "源代码打包",
      description: "项目源代码和依赖的压缩包",
      content: "",
      fileName: "ai-assistant-source-v1.0.zip",
      fileType: "zip",
    },
  },
  {
    id: 12,
    text: "生成API文档",
    command: "generating API documentation...",
    output: "API documentation completed",
    status: "pending",
    preview: {
      type: "file",
      title: "API文档",
      description: "应用程序API接口文档",
      content: "",
      fileName: "api-documentation.pdf",
      fileType: "pdf",
    },
  },
];

// WebSocket基础接口
export interface WebSocketService {
  connect(query: string): void;
  disconnect(): void;
  getStatus(): ConnectionStatus;
  sendEvent(event: WebSocketEvent): void;
  send(message: string): void;
  addEventListener(type: string, listener: (event: any) => void): void;
  removeEventListener(type: string, listener: (event: any) => void): void;
}

// 真实WebSocket服务
export class RealWebSocket implements WebSocketService {
  private socket: WebSocket | null = null;
  private listeners: Map<string, ((event: any) => void)[]> = new Map();
  private status: ConnectionStatus = "disconnected";
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private url: string;
  private query = "";

  constructor(url: string) {
    this.url = url;
  }

  connect(query: string): void {
    if (this.status === "connected" || this.status === "connecting") {
      return;
    }

    this.status = "connecting";
    this.query = query;

    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        this.status = "connected";
        this.reconnectAttempts = 0;
        this.emit("open", {});
        console.log("WebSocket connected to", this.url);

        // 发送初始查询
        this.send(
          JSON.stringify({
            type: "QUERY",
            query: this.query,
          })
        );
      };

      this.socket.onclose = (event) => {
        if (this.status === "connected") {
          console.log("WebSocket connection closed", event);
          this.status = "disconnected";
          this.emit("close", event);
          this.attemptReconnect();
        }
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.emit("error", error);

        if (this.status === "connecting") {
          this.status = "disconnected";
          this.attemptReconnect();
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const tasks = data.tasks
          this.emit("message", {
            data: { type: "STEP_UPDATE", step: tasks[tasks.length - 1] },
          });
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          this.emit("message", { data: event.data });
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      this.status = "disconnected";
      this.emit("error", error);
      this.attemptReconnect();
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.status = "disconnected";
      this.socket.close();
      this.socket = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  sendEvent(event: WebSocketEvent): void {
    this.send(JSON.stringify(event));
  }

  send(message: string): void {
    if (this.socket && this.status === "connected") {
      this.socket.send(message);
    } else {
      console.warn("Cannot send message, WebSocket is not connected");
    }
  }

  addEventListener(type: string, listener: (event: any) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)?.push(listener);
  }

  removeEventListener(type: string, listener: (event: any) => void): void {
    if (!this.listeners.has(type)) return;

    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      const index = typeListeners.indexOf(listener);
      if (index !== -1) {
        typeListeners.splice(index, 1);
      }
    }
  }

  private emit(type: string, event: any): void {
    if (!this.listeners.has(type)) return;

    const typeListeners = this.listeners.get(type);
    typeListeners?.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error(`Error in WebSocket ${type} listener:`, error);
      }
    });
  }

  private attemptReconnect(): void {
    if (this.status === "connected" || this.status === "reconnecting") {
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.status = "reconnecting";
    this.reconnectAttempts++;

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`
    );

    this.reconnectTimeout = setTimeout(() => {
      this.connect(this.query);
    }, delay);
  }
}

// 模拟WebSocket
export class MockWebSocket implements WebSocketService {
  private listeners: Map<string, ((event: any) => void)[]> = new Map();
  private status: ConnectionStatus = "disconnected";
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private simulationInterval: NodeJS.Timeout | null = null;
  private query = "";
  private currentStepIndex = 0;
  private steps: ExecutionStep[] = [...mockSteps];

  // 初始化WebSocket
  connect(query: string): void {
    if (this.status === "connected" || this.status === "connecting") {
      return;
    }

    this.status = "connecting";
    this.query = query;
    this.currentStepIndex = 0;
    this.steps = JSON.parse(JSON.stringify(mockSteps)); // 深拷贝步骤数据

    // 模拟连接延迟
    setTimeout(() => {
      if (Math.random() > 0.9) {
        // 10%概率连接失败
        this.status = "disconnected";
        this.emit("error", new Error("Connection failed"));
        this.attemptReconnect();
      } else {
        // 连接成功
        this.status = "connected";
        this.reconnectAttempts = 0;
        this.emit("open", {});

        // 开始模拟执行过程
        this.startExecution();
      }
    }, 1000);
  }

  // 断开连接
  disconnect(): void {
    this.stopExecution();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.status = "disconnected";
    this.emit("close", {});
  }

  // 获取当前连接状态
  getStatus(): ConnectionStatus {
    return this.status;
  }

  // 发送事件
  sendEvent(event: WebSocketEvent): void {
    if (this.status !== "connected") {
      console.warn("Cannot send message, WebSocket is not connected");
      return;
    }

    this.emit("message", { data: JSON.stringify(event) });
  }

  // 发送消息
  send(message: string): void {
    if (this.status !== "connected") {
      console.warn("Cannot send message, WebSocket is not connected");
      return;
    }

    this.emit("message", { data: message });
  }

  // 模拟执行过程
  private startExecution(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }

    this.simulationInterval = setInterval(() => {
      if (this.currentStepIndex < this.steps.length) {
        // 更新当前步骤状态为运行中
        const currentStep = this.steps[this.currentStepIndex];
        currentStep.status = "running";

        this.sendEvent({
          type: "STEP_UPDATE",
          step: currentStep,
        });

        // 1-3秒后完成当前步骤
        setTimeout(() => {
          if (this.status !== "connected") return;

          currentStep.status = "completed";
          this.sendEvent({
            type: "STEP_UPDATE",
            step: currentStep,
          });

          this.currentStepIndex++;

          // 检查是否所有步骤都已完成
          if (this.currentStepIndex >= this.steps.length) {
            this.sendEvent({ type: "EXECUTION_COMPLETE" });
            this.stopExecution();
          }
        }, 1000 + Math.random() * 2000);
      } else {
        this.stopExecution();
      }
    }, 3000);
  }

  // 停止执行过程
  private stopExecution(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  // 尝试重新连接
  private attemptReconnect(): void {
    if (this.status === "connected" || this.status === "reconnecting") {
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.status = "reconnecting";
    this.reconnectAttempts++;

    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);

    this.reconnectTimeout = setTimeout(() => {
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );
      this.connect(this.query);
    }, delay);
  }

  // 添加事件监听器
  addEventListener(type: string, listener: (event: any) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)?.push(listener);
  }

  // 移除事件监听器
  removeEventListener(type: string, listener: (event: any) => void): void {
    if (!this.listeners.has(type)) return;

    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      const index = typeListeners.indexOf(listener);
      if (index !== -1) {
        typeListeners.splice(index, 1);
      }
    }
  }

  // 触发事件
  private emit(type: string, event: any): void {
    if (!this.listeners.has(type)) return;

    const typeListeners = this.listeners.get(type);
    typeListeners?.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error(`Error in WebSocket ${type} listener:`, error);
      }
    });
  }
}

// WebSocket工厂函数
export function createWebSocketService(
  config: Partial<WebSocketConfig> = {}
): WebSocketService {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  if (finalConfig.useMock) {
    console.log("Using mock WebSocket service");
    return new MockWebSocket();
  } else {
    console.log(`Using real WebSocket service with URL: ${finalConfig.url}`);
    return new RealWebSocket(finalConfig.url);
  }
}

// 创建WebSocket服务实例
export const webSocketService = createWebSocketService({
  url: "ws://localhost:8765",
  useMock: false, // 设置为false使用真实WebSocket
});
