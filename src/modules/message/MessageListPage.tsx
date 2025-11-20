import { useNavigate } from "react-router-dom"
import { useGetConversationsQuery } from "../../redux/api/messageApi"
import { MessageCircle, User } from "lucide-react"
import { type RootState, useAppSelector } from "../../redux/store"

export function MessageListPage() {
  const navigate = useNavigate()
  const currentUser = useAppSelector((state: RootState) => state.user).user
  const { data, isLoading, error } = useGetConversationsQuery()

  const handleConversationClick = (username: string) => {
    if (currentUser?.username) {
      navigate(`/message/${currentUser.username}/${username}`)
    }
  }

  const formatTimestamp = (date: Date | undefined) => {
    if (!date) return ""
    const messageDate = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - messageDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return messageDate.toLocaleDateString()
  }

  return (
    <div className="w-full min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">
            Your conversations with other users
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4 text-center">
            <p className="text-destructive font-medium">Failed to load conversations</p>
          </div>
        )}

        {/* Conversation List */}
        {!isLoading && !error && data && (
          <>
            {data.conversations.length === 0 ? (
              <div className="text-center py-20">
                <MessageCircle size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-xl font-medium text-muted-foreground">No conversations yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start a conversation by visiting a user's profile
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.conversations.map((conversation) => (
                  <div
                    key={conversation.userId}
                    onClick={() => handleConversationClick(conversation.username)}
                    className="bg-card border border-border rounded-lg p-4 hover:shadow-lg hover:border-primary transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <User size={28} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                            {conversation.username}
                          </h3>
                          {conversation.lastMessageTime && (
                            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                              {formatTimestamp(conversation.lastMessageTime)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage || "No messages yet"}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="flex-shrink-0 ml-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-6 min-w-6 px-2 flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
