"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { createWebSocketService, webSocketService } from "@/lib/websocket-service"

interface ConfigPanelProps {
  onConfigChange: () => void
  defaultUrl?: string
}

export function ConfigPanel({ onConfigChange, defaultUrl = "ws://localhost:8765" }: ConfigPanelProps) {
  const [wsUrl, setWsUrl] = useState(defaultUrl)
  const [useMock, setUseMock] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = () => {
    // 重新创建WebSocket服务
    const newService = createWebSocketService({
      url: wsUrl,
      useMock: useMock,
    })

    // 替换全局实例
    Object.assign(webSocketService, newService)

    // 通知父组件配置已更改
    onConfigChange()

    // 关闭面板
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="absolute top-4 right-4 z-10 text-xs"
        onClick={() => setIsOpen(true)}
      >
        配置
      </Button>
    )
  }

  return (
    <div className="absolute top-0 right-0 z-20 p-4 bg-zinc-900 border border-zinc-700 rounded-bl-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-white">WebSocket 配置</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          关闭
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ws-url">WebSocket URL</Label>
          <Input
            id="ws-url"
            value={wsUrl}
            onChange={(e) => setWsUrl(e.target.value)}
            placeholder="ws://localhost:8765"
            className="bg-zinc-800 border-zinc-700"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="use-mock" className="cursor-pointer">
            使用模拟数据
          </Label>
          <Switch id="use-mock" checked={useMock} onCheckedChange={setUseMock} />
        </div>

        <Button onClick={handleSave} className="w-full">
          保存配置
        </Button>
      </div>
    </div>
  )
}

