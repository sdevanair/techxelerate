"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Save, Trash, Bookmark } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { BookmarkedQuestion } from "./dashboard"

interface CodeEditorProps {
  code: string
  setCode: (code: string) => void
  addBookmark: (question: BookmarkedQuestion) => void
}

export default function CodeEditor({ code, setCode, addBookmark }: CodeEditorProps) {
  const { toast } = useToast()
  const [output, setOutput] = useState("")
  const [bookmarkTitle, setBookmarkTitle] = useState("")
  const [bookmarkDescription, setBookmarkDescription] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const runCode = () => {
    try {
      // This is just a simulation of running code
      // In a real app, you'd send this to a backend
      const result = `// Output:
[Running ${code.split("\n")[0]}]
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
Execution completed successfully in 0.05s`

      setOutput(result)
      toast({
        title: "Code executed",
        description: "Your code ran successfully",
      })
    } catch (error) {
      setOutput("Error executing code")
      toast({
        title: "Execution failed",
        description: "There was an error running your code",
        variant: "destructive",
      })
    }
  }

  const saveCode = () => {
    // Simulate saving code
    toast({
      title: "Code saved",
      description: "Your code has been saved successfully",
    })
  }

  const clearCode = () => {
    setCode("")
    setOutput("")
    toast({
      title: "Editor cleared",
      description: "Code editor has been cleared",
    })
  }

  const handleBookmark = () => {
    if (!bookmarkTitle.trim()) {
      toast({
        title: "Bookmark failed",
        description: "Please provide a title for your bookmark",
        variant: "destructive",
      })
      return
    }

    const newBookmark: BookmarkedQuestion = {
      id: Date.now().toString(),
      title: bookmarkTitle,
      code: code,
      description: bookmarkDescription,
      timestamp: new Date().toISOString(),
    }

    addBookmark(newBookmark)
    setDialogOpen(false)
    setBookmarkTitle("")
    setBookmarkDescription("")

    toast({
      title: "Bookmarked",
      description: "Your code has been bookmarked successfully",
    })
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Code Editor</h2>
        <div className="flex space-x-2">
          <Button onClick={runCode} size="sm">
            <Play className="mr-2 h-4 w-4" />
            Run
          </Button>
          <Button onClick={saveCode} variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Bookmark className="mr-2 h-4 w-4" />
                Bookmark
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bookmark this code</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={bookmarkTitle}
                    onChange={(e) => setBookmarkTitle(e.target.value)}
                    className="col-span-3"
                    placeholder="Enter a title for this bookmark"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={bookmarkDescription}
                    onChange={(e) => setBookmarkDescription(e.target.value)}
                    className="col-span-3"
                    placeholder="Add a description (optional)"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBookmark}>Save Bookmark</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={clearCode} variant="outline" size="sm">
            <Trash className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-4 overflow-auto">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full resize-none bg-transparent code-editor focus:outline-none"
            spellCheck="false"
          />
        </Card>

        <Card className="p-4 overflow-auto bg-muted">
          <pre className="code-editor text-sm">{output}</pre>
        </Card>
      </div>
    </div>
  )
}

