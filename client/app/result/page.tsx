"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  CheckCircleIcon,
  ClockIcon,
  TerminalIcon,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useWebSocket } from "@/hooks/use-websocket"
import { ConnectionStatusIndicator } from "@/components/connection-status"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { PreviewContainer } from "@/components/preview/preview-container"
import { ConfigPanel } from "@/components/config-panel"
import { cn } from "@/lib/utils"

export default function ResultPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || "未提供查询"
  const [paused, setPaused] = useState(false)
  const [saving, setSaving] = useState(false)

  // 滚动容器的引用
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // 使用WebSocket钩子
  const {
    status,
    connect,
    disconnect,
    steps,
    currentStepIndex,
    isComplete,
    error,
    selectedStepId,
    setSelectedStepId,
  } = useWebSocket()

  // 获取当前选中的步骤
  const selectedStep = selectedStepId
    ? steps.find((step) => step.id === selectedStepId)
    : currentStepIndex >= 0 && currentStepIndex < steps.length
      ? steps[currentStepIndex]
      : null

  // 滚动到底部的函数
  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current
      scrollContainerRef.current.scrollTop = scrollHeight - clientHeight
    }
  }, [])

  // 当步骤更新时自动滚动
  useEffect(() => {
    if (steps.length > 0) {
      scrollToBottom()
    }
  }, [steps, currentStepIndex, scrollToBottom])

  // 配置更改处理函数
  const handleConfigChange = useCallback(() => {
    // 重新连接WebSocket
    disconnect()
    setTimeout(() => {
      connect(query)
    }, 500)
  }, [connect, disconnect, query])

  // 初始连接
  useEffect(() => {
    connect(query)

    // 组件卸载时断开连接
    return () => {
      disconnect()
    }
  }, [connect, disconnect, query])

  // 暂停/继续
  const togglePlayPause = () => {
    setPaused(!paused)

    if (paused) {
      // 如果当前是暂停状态，继续执行
      connect(query)
    } else {
      // 如果当前是执行状态，暂停执行
      disconnect()
    }
  }

  // 重置演示
  const resetDemo = () => {
    setPaused(false)
    connect(query)
  }

  // 跳到结束
  const skipToEnd = () => {
    toast({
      title: "快进功能",
      description: "此功能需要服务端支持，暂未实现",
    })
  }

  // 保存结果
  const handleSaveResult = async () => {
    try {
      setSaving(true)
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast({
        title: "保存成功",
        description: "结果已成功保存",
      })
    } catch (error) {
      toast({
        title: "保存失败",
        description: "无法保存结果，请稍后再试",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // 处理步骤点击
  const handleStepClick = (stepId: number) => {
    setSelectedStepId(stepId)
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-950 relative">
      {/* 配置面板 */}
      <ConfigPanel onConfigChange={handleConfigChange} />

      {/* 顶部导航 */}
      <header className="bg-zinc-900 border-b border-zinc-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-white font-bold text-xl">AI Assistant</div>
            <ConnectionStatusIndicator status={status} />
          </div>
          <Button
            variant="outline"
            className="text-zinc-400 border-zinc-700 hover:text-white hover:bg-zinc-800"
            onClick={handleSaveResult}
            disabled={saving || !isComplete}
          >
            {saving ? "保存中..." : "保存结果"}
          </Button>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧执行过程 */}
        <div className="w-1/2 border-r border-zinc-800 flex flex-col">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900">
            <h2 className="text-white font-medium">用户查询</h2>
            <p className="text-zinc-400 mt-2">{query}</p>
          </div>

          {error && (
            <Alert variant="destructive" className="m-4 border-red-900 bg-red-950 text-red-400">
              <AlertTitle>连接错误</AlertTitle>
              <AlertDescription>
                {error}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetDemo}
                  className="mt-2 bg-red-950 border-red-800 text-red-400 hover:bg-red-900 hover:text-white"
                >
                  重试连接
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div ref={scrollContainerRef} className="flex-1 overflow-auto p-4 bg-zinc-950">
            {status === "connected" && steps.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-zinc-400">准备执行中...</div>
              </div>
            )}

            {status !== "connected" && steps.length === 0 && !error && (
              <div className="flex items-center justify-center h-full">
                <div className="text-zinc-400">
                  {status === "connecting" ? "正在连接..." : status === "reconnecting" ? "正在重新连接..." : "未连接"}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "p-3 rounded-lg border transition-all cursor-pointer",
                    step.status === "completed"
                      ? "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
                      : step.status === "running"
                        ? "border-zinc-700 bg-zinc-900 border-l-blue-500 border-l-2"
                        : "border-zinc-800 bg-zinc-900/50 opacity-50",
                    selectedStepId === step.id && "ring-2 ring-blue-500/50",
                  )}
                  onClick={() => handleStepClick(step.id)}
                >
                  <div className="flex items-center gap-2">
                    {step.status === "completed" ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : step.status === "running" ? (
                      <ClockIcon className="h-5 w-5 text-blue-500 animate-pulse" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-zinc-700" />
                    )}
                    <span className="text-white font-medium">{step.text}</span>
                  </div>

                  {(step.status === "running" || step.status === "completed") && (
                    <div className="mt-2 bg-black rounded p-2 font-mono text-sm">
                      <div className="flex items-start gap-2">
                        <div className="bg-zinc-800 rounded p-1 mt-0.5">
                          <TerminalIcon className="h-4 w-4 text-zinc-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-zinc-400 mb-1">
                            $ <span className="text-green-400">{step.command}</span>
                          </div>
                          {step.output && (
                            <div className="text-zinc-300 pl-2 border-l-2 border-zinc-700">{step.output}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isComplete && (
                <div className="p-3 rounded-lg border border-green-900 bg-green-950">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span className="font-medium">生成完成！</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 border-t border-zinc-800 bg-zinc-900 flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={resetDemo}
              className="text-zinc-400 hover:text-white"
              disabled={status === "connecting" || status === "reconnecting"}
            >
              <SkipBackIcon className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={togglePlayPause}
              className="text-zinc-400 hover:text-white"
              disabled={status === "connecting" || status === "reconnecting" || isComplete}
            >
              {paused || status !== "connected" ? <PlayIcon className="h-5 w-5" /> : <PauseIcon className="h-5 w-5" />}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={skipToEnd}
              className="text-zinc-400 hover:text-white"
              disabled={status !== "connected" || isComplete}
            >
              <SkipForwardIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* 右侧预览 */}
        <div className="w-1/2 flex flex-col">
          {selectedStep && selectedStep.preview ? (
            <PreviewContainer
              title={selectedStep.preview.title}
              description={selectedStep.preview.description}
              type={selectedStep.preview.type}
              content={selectedStep.preview.content}
              language={selectedStep.preview.language}
              fileName={selectedStep.preview.fileName}
              fileType={selectedStep.preview.fileType}
            />
          ) : (
            <div className="flex flex-col h-full items-center justify-center bg-zinc-900 text-zinc-400">
              <p>选择左侧步骤查看详细内容</p>
              <p className="text-sm mt-2">或等待执行过程自动更新预览</p>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  )
}

