import { baseApi } from "./baseApi";
import {
  Message,
  SendMessageRequest,
  ConversationListResponse,
  MessageHistoryResponse,
  UnreadCountResponse,
  MarkAsReadRequest,
} from "../types/message";

const MESSAGE_API = import.meta.env.VITE_API_URL + "message";

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<Message, SendMessageRequest>({
      query: (body) => ({
        url: MESSAGE_API + "/send",
        method: "POST",
        body,
      }),
      invalidatesTags: ['Message'],
    }),
    getConversations: builder.query<ConversationListResponse, void>({
      query: () => ({
        url: MESSAGE_API + "/conversations",
        method: "GET",
      }),
      providesTags: ['Message'],
    }),
    getMessageHistory: builder.query<MessageHistoryResponse, string>({
      query: (otherUserId) => ({
        url: MESSAGE_API + `/history/${otherUserId}`,
        method: "GET",
      }),
      providesTags: ['Message'],
    }),
    markAsRead: builder.mutation<void, MarkAsReadRequest>({
      query: (body) => ({
        url: MESSAGE_API + "/mark-read",
        method: "POST",
        body,
      }),
      invalidatesTags: ['Message'],
    }),
    deleteConversation: builder.mutation<void, string>({
      query: (otherUserId) => ({
        url: MESSAGE_API + `/conversation/${otherUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Message'],
    }),
    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => ({
        url: MESSAGE_API + "/unread-count",
        method: "GET",
      }),
      providesTags: ['Message'],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetConversationsQuery,
  useGetMessageHistoryQuery,
  useMarkAsReadMutation,
  useDeleteConversationMutation,
  useGetUnreadCountQuery,
} = messageApi;
