"use client"

import { useMemo } from "react"
import { TerminalIcon, FileTextIcon, ImageIcon, CodeIcon, FileIcon, FileSpreadsheetIcon, FileIcon as FilePresentationIcon, FileTypeIcon, FileArchiveIcon, FileCodeIcon, FileJsonIcon, FileVideoIcon, FileAudioIcon, FileXIcon, FileCheckIcon } from 'lucide-react'
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { cn } from "@/lib/utils"

export type PreviewType = "text" | "code" | "terminal" | "image" | "markdown" | "file"

interface PreviewContentProps {
  type: PreviewType;
  content: string;
  language?: string;
  alt?: string;
  fileName?: string;
  fileType?: string;
}

export function PreviewContent({ 
  type, 
  content, 
  language = "plaintext", 
  alt,
  fileName,
  fileType 
}: PreviewContentProps) {
  // 根据内容类型返回适当的图标
  const getIcon = () => {
    switch (type) {
      case "terminal":
        return <TerminalIcon className="h-4 w-4" />
      case "code":
        return <CodeIcon className="h-4 w-4" />
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "file":
        return <FileIcon className="h-4 w-4" />
      default:
        return <FileTextIcon className="h-4 w-4" />
    }
  }

  // 根据文件类型获取适当的图标
  const getFileIcon = () => {
    if (!fileType) return <FileIcon className="h-12 w-12 text-zinc-400" />;
    
    const extension = fileType.toLowerCase();
    
    switch (extension) {
      // 文档类型
      case "doc":
      case "docx":
        return <FileTextIcon className="h-12 w-12 text-blue-400" />
      
      // 电子表格
      case "xls":
      case "xlsx":
      case "csv":
        return <FileSpreadsheetIcon className="h-12 w-12 text-green-400" />
      
      // 演示文稿
      case "ppt":
      case "pptx":
        return <FilePresentationIcon className="h-12 w-12 text-orange-400" />
      
      // 纯文本
      case "txt":
        return <FileTypeIcon className="h-12 w-12 text-zinc-400" />
      
      // 压缩文件
      case "zip":
      case "rar":
      case "7z":
      case "tar":
      case "gz":
        return <FileArchiveIcon className="h-12 w-12 text-purple-400" />
      
      // 代码文件
      case "js":
      case "ts":
      case "jsx":
      case "tsx":
      case "html":
      case "css":
      case "php":
      case "py":
      case "java":
      case "c":
      case "cpp":
        return <FileCodeIcon className="h-12 w-12 text-yellow-400" />
      
      // 数据文件
      case "json":
      case "xml":
        return <FileJsonIcon className="h-12 w-12 text-amber-400" />
      
      // 媒体文件
      case "mp4":
      case "avi":
      case "mov":
      case "wmv":
        return <FileVideoIcon className="h-12 w-12 text-red-400" />
      
      case "mp3":
      case "wav":
      case "ogg":
      case "flac":
        return <FileAudioIcon className="h-12 w-12 text-pink-400" />
      
      // PDF文件
      case "pdf":
        return <FileCheckIcon className="h-12 w-12 text-red-500" />
      
      // 默认图标
      default:
        return <FileXIcon className="h-12 w-12 text-zinc-400" />
    }
  }

  // 处理代码高亮
  const highlightedContent = useMemo(() => {
    if (type === "code" || type === "terminal") {
      return (
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
          }}
        >
          {content}
        </SyntaxHighlighter>
      )
    }
    return null
  }, [type, content, language])

  return (
    <div className="h-full overflow-auto bg-zinc-900">
      {/* 预览类型标识 */}
      <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800">
        {getIcon()}
        <span className="capitalize">{type}</span>
        {fileType && <span className="text-zinc-500 ml-1">({fileType})</span>}
      </div>

      {/* 预览内容 */}
      <div className="p-4">
        {type === "text" && <div className="text-zinc-300 whitespace-pre-wrap">{content}</div>}

        {(type === "code" || type === "terminal") && <div className="font-mono text-sm">{highlightedContent}</div>}

        {type === "image" && (
          <div className="flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content || "/placeholder.svg"}
              alt={alt || "Preview image"}
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}

        {type === "markdown" && (
          <div className="prose prose-invert max-w-none text-white">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}

        {type === "file" && (
          <div className="flex flex-col items-center justify-center p-6 bg-zinc-800/50 rounded-lg border border-zinc-700">
            {getFileIcon()}
            <div className="mt-4 text-center">
              <div className="text-white font-medium break-all max-w-full">
                {fileName || "未命名文件"}
              </div>
              {fileType && (
                <div className="text-zinc-400 text-sm mt-1">
                  {fileType.toUpperCase()} 文件
                </div>
              )}
              <div className="mt-4" onClick={() => {
                window.open(`http://localhost:8080/tmp/${fileName}`)
              }}>
                <div className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-zinc-700 rounded-md hover:bg-zinc-600 transition-colors">
                  下载文件
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

