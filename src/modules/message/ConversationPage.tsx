import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  useGetMessageHistoryQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useDeleteConversationMutation,
} from "../../redux/api/messageApi"
import { useGetUserByUsernameQuery } from "../../redux/api/authAPi"
import { type RootState, useAppSelector } from "../../redux/store"
import { Send, Trash2, ArrowLeft, User } from "lucide-react"
import { Message } from "../../redux/types/message"

export function ConversationPage() {
  const { otherUsername } = useParams<{ selfUsername: string; otherUsername: string }>()
  const navigate = useNavigate()
  const currentUser = useAppSelector((state: RootState) => state.user).user
  const token = useAppSelector((state: RootState) => state.user).token
  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const { data: otherUserData } = useGetUserByUsernameQuery(otherUsername || "")
  const { data: historyData, isLoading } = useGetMessageHistoryQuery(otherUserData?.id || "", {
    skip: !otherUserData?.id,
  })
  const [sendMessage] = useSendMessageMutation()
  const [markAsRead] = useMarkAsReadMutation()
  const [deleteConversation] = useDeleteConversationMutation()

  // Initialize messages from history
  useEffect(() => {
    if (historyData?.messages) {
      setMessages(historyData.messages)
    }
  }, [historyData])

  // Mark messages as read when opening conversation
  useEffect(() => {
    if (otherUserData?.id && currentUser?.userId) {
      markAsRead({ senderId: otherUserData.id })
    }
  }, [otherUserData?.id, currentUser?.userId, markAsRead])

  // Setup SSE connection for real-time messages
  useEffect(() => {
    if (!token || !otherUserData?.id) return

    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_URL}message/stream`,
      {
        withCredentials: true,
      }
    )

    // Add Authorization header using fetch wrapper
    const connectSSE = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}message/stream`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          console.error("SSE connection failed")
          return
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) return

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const message = JSON.parse(line.substring(6))
                if (message.senderId === otherUserData.id) {
                  setMessages((prev) => [...prev, message])
                  // Mark as read immediately
                  markAsRead({ senderId: otherUserData.id })
                }
              } catch (e) {
                console.error("Failed to parse SSE message", e)
              }
            }
          }
        }
      } catch (error) {
        console.error("SSE error:", error)
      }
    }

    connectSSE()

    return () => {
      eventSource.close()
    }
  }, [token, otherUserData?.id, markAsRead])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !otherUserData?.id) return

    try {
      const result = await sendMessage({
        receiverId: otherUserData.id,
        message: messageInput,
      }).unwrap()

      // Add message to local state
      setMessages((prev) => [...prev, result])
      setMessageInput("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleDeleteConversation = async () => {
    if (!otherUserData?.id) return

    try {
      await deleteConversation(otherUserData.id).unwrap()
      navigate("/messages")
    } catch (error) {
      console.error("Failed to delete conversation:", error)
    }
  }

  const formatTimestamp = (date: Date) => {
    const messageDate = new Date(date)
    const now = new Date()
    const isToday = messageDate.toDateString() === now.toDateString()

    if (isToday) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen pt-20 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen pt-16 pb-0 flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-16 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/messages")}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="font-bold">{otherUsername}</h2>
            <p className="text-xs text-muted-foreground">
              {otherUserData?.description || "Storytell user"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
          title="Delete conversation"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSentByMe = msg.senderId === currentUser?.userId
            return (
              <div
                key={msg.id}
                className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isSentByMe
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="break-words whitespace-pre-wrap">{msg.message}</p>
                  <div className={`text-xs mt-1 ${isSentByMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {formatTimestamp(msg.timeSent)}
                    {isSentByMe && msg.isRead && " · Read"}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-card border-t border-border px-4 py-3 sticky bottom-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-card rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Delete Conversation?</h3>
            <p className="text-muted-foreground mb-6">
              This will permanently delete all messages in this conversation. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConversation}
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
