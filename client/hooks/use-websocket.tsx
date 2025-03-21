"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  webSocketService,
  type WebSocketEvent,
  type ConnectionStatus,
  type ExecutionStep,
} from "@/lib/websocket-service";

// WebSocket钩子的返回类型
interface UseWebSocketReturn {
  status: ConnectionStatus;
  connect: (query: string) => void;
  disconnect: () => void;
  sendEvent: (event: WebSocketEvent) => void;
  steps: ExecutionStep[];
  currentStepIndex: number;
  isComplete: boolean;
  error: string | null;
  selectedStepId: number | null;
  setSelectedStepId: (id: number | null) => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [steps, setSteps] = useState<ExecutionStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);

  // 使用refs来存储最新的状态，避免闭包问题
  const stepsRef = useRef<ExecutionStep[]>([]);

  // 连接WebSocket
  const connect = useCallback((query: string) => {
    // 重置状态
    setSteps([]);
    setCurrentStepIndex(-1);
    setIsComplete(false);
    setError(null);
    setSelectedStepId(null);
    stepsRef.current = [];

    // 连接WebSocket
    webSocketService.connect(query);
  }, []);

  // 断开WebSocket连接
  const disconnect = useCallback(() => {
    webSocketService.disconnect();
  }, []);

  // 发送WebSocket事件
  const sendEvent = useCallback((event: WebSocketEvent) => {
    webSocketService.sendEvent(event);
  }, []);

  // 设置事件监听器
  useEffect(() => {
    // WebSocket打开连接
    const handleOpen = () => {
      setStatus("connected");
      setError(null);
    };

    // WebSocket关闭连接
    const handleClose = () => {
      setStatus("disconnected");
    };

    // WebSocket接收消息
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = event.data;

        switch (data.type) {
          case "STEP_UPDATE": {
            const updatedStep = data.step;
            let newSteps: ExecutionStep[] = [];

            // 如果步骤已存在，则更新它
            if (stepsRef.current.some((step) => step.id === updatedStep.id)) {
              newSteps = stepsRef.current.map((step) =>
                step.id === updatedStep.id ? updatedStep : step
              );
            } else {
              // 否则添加新步骤
              newSteps = [...stepsRef.current, updatedStep];
            }
            console.log("watch 666:", event.data, newSteps);
            stepsRef.current = newSteps;
            setSteps(newSteps);
            // 更新当前步骤索引
            if (updatedStep.status === "running") {
              const newIndex = newSteps.findIndex(
                (step) => step.id === updatedStep.id
              );
              setCurrentStepIndex(newIndex);

              // 自动选择当前运行的步骤
              setSelectedStepId(updatedStep.id);
            } else if (updatedStep.status === "completed") {
              setIsComplete(true);
            } else {
              setError("系统异常");
              setIsComplete(true);
            }
            break;
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    // WebSocket发生错误
    const handleError = (error: Event) => {
      setError("WebSocket connection error");
      console.error("WebSocket error:", error);
    };

    // 监听WebSocket状态变化
    const checkStatus = () => {
      const currentStatus = webSocketService.getStatus();
      if (currentStatus !== status) {
        setStatus(currentStatus);
      }
    };

    // 添加事件监听器
    webSocketService.addEventListener("open", handleOpen);
    webSocketService.addEventListener("close", handleClose);
    webSocketService.addEventListener("message", handleMessage);
    webSocketService.addEventListener("error", handleError);

    // 定期检查连接状态
    const statusInterval = setInterval(checkStatus, 1000);

    // 清理函数
    return () => {
      webSocketService.removeEventListener("open", handleOpen);
      webSocketService.removeEventListener("close", handleClose);
      webSocketService.removeEventListener("message", handleMessage);
      webSocketService.removeEventListener("error", handleError);
      clearInterval(statusInterval);
    };
  }, [status]);

  return {
    status,
    connect,
    disconnect,
    sendEvent,
    steps,
    currentStepIndex,
    isComplete,
    error,
    selectedStepId,
    setSelectedStepId,
  };
}
