"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PaperclipIcon } from "lucide-react"

export default function Home() {
  const [query, setQuery] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSubmitting(true)

    try {
      // 这里可以添加任何预处理逻辑

      // 导航到结果页
      router.push(`/result?query=${encodeURIComponent(query)}`)
    } catch (error) {
      console.error("Error submitting query:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black relative overflow-hidden">
      {/* 星空背景 */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gray-400/20"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-2xl px-4 z-10">
        <div className="bg-zinc-900/90 rounded-lg p-8 backdrop-blur-sm border border-zinc-800">
          <h1 className="text-white text-4xl font-bold text-center mb-8">What can I help you?</h1>

          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="tips: 注意配色方面的细节，可以参考一些国外站点的设计，动效尽可能的多一些"
                className="min-h-24 bg-zinc-900 border-zinc-700 text-white resize-none"
                disabled={isSubmitting}
              />

              <div className="absolute bottom-3 left-3 flex gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                  disabled={isSubmitting}
                >
                  <PaperclipIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                className="bg-white text-black hover:bg-gray-200"
                disabled={!query.trim() || isSubmitting}
              >
                {isSubmitting ? "处理中..." : "Generate HTML"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

