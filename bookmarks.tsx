"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { BookmarkedQuestion } from "./dashboard"
import { Trash, Code, MessageSquare } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface BookmarksProps {
  bookmarkedQuestions: BookmarkedQuestion[]
  removeBookmark: (id: string) => void
  loadBookmarkedCode: (code: string) => void
}

export default function Bookmarks({ bookmarkedQuestions, removeBookmark, loadBookmarkedCode }: BookmarksProps) {
  const [selectedBookmark, setSelectedBookmark] = useState<BookmarkedQuestion | null>(null)
  const [aiSolution, setAiSolution] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const generateSolution = async (question: BookmarkedQuestion) => {
    setSelectedBookmark(question)
    setIsLoading(true)
    setDialogOpen(true)

    try {
      const prompt = `
        I need help with the following code problem:
        
        ${question.description}
        
        Here's the code:
        
        ${question.code}
        
        Please provide a detailed explanation of how this code works, any potential issues, and suggestions for improvement.
      `

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (data.error) {
        setAiSolution("Sorry, I couldn't generate a solution at this time. Please try again later.")
      } else {
        setAiSolution(data.response)
      }
    } catch (error) {
      console.error("Error generating solution:", error)
      setAiSolution("An error occurred while generating the solution. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <h2 className="text-2xl font-bold">Bookmarked Questions</h2>

      {bookmarkedQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Trash className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No bookmarks yet</h3>
          <p className="text-muted-foreground mt-2">Bookmark interesting code problems to save them for later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarkedQuestions.map((question) => (
            <Card key={question.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{question.title}</CardTitle>
                <CardDescription>{new Date(question.timestamp).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm line-clamp-3">{question.description || "No description provided."}</p>
                <div className="mt-4 bg-muted p-2 rounded-md max-h-24 overflow-hidden">
                  <pre className="text-xs">{question.code.slice(0, 150)}...</pre>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => loadBookmarkedCode(question.code)}>
                    <Code className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => generateSolution(question)}>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    AI Solution
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBookmark(question.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedBookmark?.title}</DialogTitle>
            <DialogDescription>AI-generated solution for your code problem</DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center">
                <div className="flex space-x-2">
                  <div
                    className="w-3 h-3 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-3 h-3 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-3 h-3 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Generating solution with Gemini AI...</p>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <div className="bg-muted p-4 rounded-md mb-4">
                <h4 className="font-medium mb-2">Original Code:</h4>
                <pre className="text-xs overflow-x-auto">{selectedBookmark?.code}</pre>
              </div>
              <div className="whitespace-pre-line">
                <h4 className="font-medium mb-2">AI Solution:</h4>
                {aiSolution}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

