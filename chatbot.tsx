"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SendHorizontal, Code } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp: string
  isCode?: boolean
}

interface ChatBotProps {
  code?: string
}

export default function ChatBot({ code }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hi there! I'm your coding assistant powered by Gemini AI. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, messagesEndRef])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Prepare context with current code if available
      let prompt = input
      if (code) {
        prompt = `The user is working with the following code:\n\n${code}\n\nUser question: ${input}`
      }

      // Call Gemini API
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (data.error) {
        toast({
          title: "Error",
          description: "Failed to get response from AI. Please try again.",
          variant: "destructive",
        })

        const errorMessage: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content: "I'm sorry, I encountered an error processing your request. Please try again later.",
          timestamp: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, errorMessage])
      } else {
        // Check if response contains code blocks
        const responseText = data.response

        // Simple detection for code blocks (anything between triple backticks)
        const codeBlockRegex = /```(?:[\w]*)\n([\s\S]*?)```/g
        let match
        let lastIndex = 0
        const messageParts: Message[] = []

        while ((match = codeBlockRegex.exec(responseText)) !== null) {
          // Add text before code block
          if (match.index > lastIndex) {
            const textBefore = responseText.substring(lastIndex, match.index)
            if (textBefore.trim()) {
              messageParts.push({
                id: Date.now() + messageParts.length,
                role: "assistant",
                content: textBefore,
                timestamp: new Date().toISOString(),
              })
            }
          }

          // Add code block
          messageParts.push({
            id: Date.now() + messageParts.length,
            role: "assistant",
            content: match[1],
            timestamp: new Date().toISOString(),
            isCode: true,
          })

          lastIndex = match.index + match[0].length
        }

        // Add remaining text after last code block
        if (lastIndex < responseText.length) {
          const textAfter = responseText.substring(lastIndex)
          if (textAfter.trim()) {
            messageParts.push({
              id: Date.now() + messageParts.length,
              role: "assistant",
              content: textAfter,
              timestamp: new Date().toISOString(),
            })
          }
        }

        // If no code blocks were found, add the entire response as a single message
        if (messageParts.length === 0) {
          messageParts.push({
            id: Date.now() + 1,
            role: "assistant",
            content: responseText,
            timestamp: new Date().toISOString(),
          })
        }

        setMessages((prev) => [...prev, ...messageParts])
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error)

      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "I'm sorry, I encountered an error processing your request. Please try again later.",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, errorMessage])

      toast({
        title: "Error",
        description: "Failed to connect to AI service. Please check your connection.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShareCode = () => {
    if (!code) {
      toast({
        title: "No code available",
        description: "There is no code in the editor to share.",
        variant: "destructive",
      })
      return
    }

    setInput(`Can you help me understand and improve this code?\n\n${code}`)
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Assistant (Gemini)</h2>
        {code && (
          <Button variant="outline" size="sm" onClick={handleShareCode}>
            <Code className="mr-2 h-4 w-4" />
            Share Current Code
          </Button>
        )}
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Chat with AI</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-start max-w-[80%]">
                  {message.role === "assistant" && (
                    <Avatar className="mr-2">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : message.isCode
                          ? "bg-secondary font-mono"
                          : "bg-muted"
                    }`}
                  >
                    <pre
                      className={`text-sm ${message.isCode ? "whitespace-pre overflow-x-auto" : "whitespace-normal"}`}
                    >
                      {message.content}
                    </pre>
                    <p className="text-xs opacity-70 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="ml-2">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start max-w-[80%]">
                  <Avatar className="mr-2">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-muted">
                    <div className="flex space-x-2">
                      <div
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <form onSubmit={handleSendMessage} className="w-full flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your code..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

