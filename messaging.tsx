"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SendHorizontal, Search } from "lucide-react"

interface Message {
  id: number
  senderId: number
  content: string
  timestamp: string
}

interface Contact {
  id: number
  name: string
  avatar: string
  status: "online" | "offline"
  lastSeen?: string
}

export default function Messaging() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: "Sarah Johnson", avatar: "/placeholder.svg?height=40&width=40", status: "online" },
    {
      id: 2,
      name: "Alex Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      lastSeen: "2 hours ago",
    },
    { id: 3, name: "Michael Brown", avatar: "/placeholder.svg?height=40&width=40", status: "online" },
    {
      id: 4,
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      lastSeen: "1 day ago",
    },
  ])

  const [selectedContact, setSelectedContact] = useState<Contact>(contacts[0])

  const [messages, setMessages] = useState<Record<number, Message[]>>({
    1: [
      {
        id: 1,
        senderId: 1,
        content: "Hey, how's your progress with the algorithms?",
        timestamp: "2023-03-06T10:30:00Z",
      },
      {
        id: 2,
        senderId: 0,
        content: "I'm working on bubble sort right now. It's coming along well!",
        timestamp: "2023-03-06T10:32:00Z",
      },
      { id: 3, senderId: 1, content: "Great! Let me know if you need any help.", timestamp: "2023-03-06T10:33:00Z" },
    ],
    2: [
      { id: 1, senderId: 2, content: "Did you finish the React assignment?", timestamp: "2023-03-05T15:20:00Z" },
      {
        id: 2,
        senderId: 0,
        content: "Almost done! Just fixing some styling issues.",
        timestamp: "2023-03-05T15:25:00Z",
      },
    ],
    3: [
      { id: 1, senderId: 3, content: "Can we review the database design tomorrow?", timestamp: "2023-03-06T09:10:00Z" },
      { id: 2, senderId: 0, content: "Sure, I'm free after 2 PM.", timestamp: "2023-03-06T09:15:00Z" },
      { id: 3, senderId: 3, content: "Perfect, let's meet at 3 PM then.", timestamp: "2023-03-06T09:17:00Z" },
    ],
    4: [
      { id: 1, senderId: 4, content: "Have you seen the new Python course?", timestamp: "2023-03-04T14:05:00Z" },
      { id: 2, senderId: 0, content: "Not yet, is it good?", timestamp: "2023-03-04T14:10:00Z" },
      { id: 3, senderId: 4, content: "It's excellent! You should check it out.", timestamp: "2023-03-04T14:12:00Z" },
    ],
  })

  const [input, setInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now(),
      senderId: 0, // Current user
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
    }))

    setInput("")

    // Simulate response
    setTimeout(() => {
      const responseMessage: Message = {
        id: Date.now() + 1,
        senderId: selectedContact.id,
        content: `Thanks for your message: "${input}"`,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), responseMessage],
      }))
    }, 1000)
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <h2 className="text-2xl font-bold">Messages</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        <Card className="md:col-span-1 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Contacts</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-2">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-muted ${
                    selectedContact.id === contact.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                        contact.status === "online" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {contact.status === "online" ? "Online" : `Last seen ${contact.lastSeen}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">{selectedContact.name}</CardTitle>
              <span
                className={`ml-2 h-2 w-2 rounded-full ${
                  selectedContact.status === "online" ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-4">
              {messages[selectedContact.id]?.map((message) => (
                <div key={message.id} className={`flex ${message.senderId === 0 ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-start max-w-[80%]">
                    {message.senderId !== 0 && (
                      <Avatar className="mr-2 h-8 w-8">
                        <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                        <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`rounded-lg p-3 ${
                        message.senderId === 0 ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</p>
                    </div>

                    {message.senderId === 0 && (
                      <Avatar className="ml-2 h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Me" />
                        <AvatarFallback>ME</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="pt-0">
            <form onSubmit={handleSendMessage} className="w-full flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

