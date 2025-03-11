"use client"

import { MaximizeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PreviewHeaderProps {
  title: string
  description?: string
  onMaximize?: () => void
}

export function PreviewHeader({ title, description, onMaximize }: PreviewHeaderProps) {
  return (
    <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-white truncate">{title}</h2>
          {description && <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{description}</p>}
        </div>
        {onMaximize && (
          <Button variant="ghost" size="icon" className="ml-4 text-zinc-400 hover:text-white" onClick={onMaximize}>
            <MaximizeIcon className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}

