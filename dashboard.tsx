"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import CodeEditor from "@/components/code-editor"
import ChatBot from "@/components/chatbot"
import Messaging from "@/components/messaging"
import CodeExplainer from "@/components/code-explainer"
import Bookmarks from "@/components/bookmarks"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface BookmarkedQuestion {
  id: string
  title: string
  code: string
  description: string
  timestamp: string
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("editor")
  const [code, setCode] = useState(`function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}`)

  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<BookmarkedQuestion[]>([])

  // Load bookmarks from localStorage on initial render
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarkedQuestions")
    if (savedBookmarks) {
      setBookmarkedQuestions(JSON.parse(savedBookmarks))
    }
  }, [])

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bookmarkedQuestions", JSON.stringify(bookmarkedQuestions))
  }, [bookmarkedQuestions])

  const addBookmark = (question: BookmarkedQuestion) => {
    setBookmarkedQuestions((prev) => {
      // Check if already bookmarked
      if (prev.some((q) => q.id === question.id)) {
        return prev
      }
      return [...prev, question]
    })
  }

  const removeBookmark = (id: string) => {
    setBookmarkedQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const loadBookmarkedCode = (code: string) => {
    setCode(code)
    setActiveTab("editor")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="editor">Code Editor</TabsTrigger>
              <TabsTrigger value="chatbot">AI Assistant</TabsTrigger>
              <TabsTrigger value="messaging">Messages</TabsTrigger>
              <TabsTrigger value="explainer">Code Explainer</TabsTrigger>
              <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="h-[calc(100%-40px)]">
              <CodeEditor code={code} setCode={setCode} addBookmark={addBookmark} />
            </TabsContent>
            <TabsContent value="chatbot" className="h-[calc(100%-40px)]">
              <ChatBot code={code} />
            </TabsContent>
            <TabsContent value="messaging" className="h-[calc(100%-40px)]">
              <Messaging />
            </TabsContent>
            <TabsContent value="explainer" className="h-[calc(100%-40px)]">
              <CodeExplainer code={code} />
            </TabsContent>
            <TabsContent value="bookmarks" className="h-[calc(100%-40px)]">
              <Bookmarks
                bookmarkedQuestions={bookmarkedQuestions}
                removeBookmark={removeBookmark}
                loadBookmarkedCode={loadBookmarkedCode}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

