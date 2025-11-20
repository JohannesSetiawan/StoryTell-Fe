export type Message = {
  id: string
  senderId: string
  receiverId: string
  message: string
  timeSent: Date
  isRead: boolean
  timeRead?: Date
}

export type SendMessageRequest = {
  receiverId: string
  message: string
}

export type Conversation = {
  userId: string
  username: string
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
}

export type ConversationListResponse = {
  conversations: Conversation[]
}

export type MessageHistoryResponse = {
  messages: Message[]
}

export type UnreadCountResponse = {
  unreadCount: number
  hasUnread: boolean
}

export type MarkAsReadRequest = {
  senderId: string
}
