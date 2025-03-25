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
          console.log("WebSocket message received:", data);
          if (Reflect.has(data, "taskId")) {
            this.emit("message", {
              data: { step: tasks[tasks.length - 1] },
            });
            return
          }
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

// WebSocket工厂函数
export function createWebSocketService(
  config: Partial<WebSocketConfig> = {}
): WebSocketService {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

    return new RealWebSocket(finalConfig.url);
}

// 创建WebSocket服务实例
export const webSocketService = createWebSocketService({
  url: "ws://localhost:8765",
  useMock: false, // 设置为false使用真实WebSocket
});
