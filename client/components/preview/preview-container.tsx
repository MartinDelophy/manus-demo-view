"use client"

import { useState } from "react"
import { PreviewHeader } from "./preview-header"
import { PreviewContent, type PreviewType } from "./preview-content"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface PreviewContainerProps {
  title: string;
  description?: string;
  type: PreviewType;
  content: string;
  language?: string;
  alt?: string;
  fileName?: string;
  fileType?: string;
}

export function PreviewContainer({ 
  title, 
  description, 
  type, 
  content, 
  language, 
  alt,
  fileName,
  fileType
}: PreviewContainerProps) {
  const [isMaximized, setIsMaximized] = useState(false)

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  return (
    <>
      <div className="flex flex-col h-full bg-zinc-950">
        <PreviewHeader title={title} description={description} onMaximize={toggleMaximize} />
        <div className="flex-1 overflow-hidden">
          <PreviewContent 
            type={type} 
            content={content} 
            language={language} 
            alt={alt}
            fileName={fileName}
            fileType={fileType}
          />
        </div>
      </div>

      <Dialog open={isMaximized} onOpenChange={setIsMaximized}>
        <DialogContent className="max-w-6xl w-[90vw] h-[90vh] p-0">
          <div className="flex flex-col h-full">
            <PreviewHeader title={title} description={description} onMaximize={toggleMaximize} />
            <div className="flex-1 overflow-hidden">
              <PreviewContent 
                type={type} 
                content={content} 
                language={language} 
                alt={alt}
                fileName={fileName}
                fileType={fileType}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

