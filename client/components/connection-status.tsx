import { Badge } from "@/components/ui/badge"
import type { ConnectionStatus } from "@/lib/websocket-service"
import { WifiIcon, WifiOffIcon, Loader2Icon } from "lucide-react"

interface ConnectionStatusProps {
  status: ConnectionStatus
}

export function ConnectionStatusIndicator({ status }: ConnectionStatusProps) {
  switch (status) {
    case "connected":
      return (
        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800 gap-1.5">
          <WifiIcon className="h-3.5 w-3.5" />
          <span>已连接</span>
        </Badge>
      )

    case "connecting":
      return (
        <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-800 gap-1.5">
          <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
          <span>连接中</span>
        </Badge>
      )

    case "reconnecting":
      return (
        <Badge variant="outline" className="bg-amber-900/30 text-amber-400 border-amber-800 gap-1.5">
          <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
          <span>重新连接中</span>
        </Badge>
      )

    case "disconnected":
    default:
      return (
        <Badge variant="outline" className="bg-red-900/30 text-red-400 border-red-800 gap-1.5">
          <WifiOffIcon className="h-3.5 w-3.5" />
          <span>未连接</span>
        </Badge>
      )
  }
}

