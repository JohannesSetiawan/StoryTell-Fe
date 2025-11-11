import { baseApi } from "./baseApi";
import { CommentRequest, CommentResponse, AllCommentResponse } from "../types/comment";
import { Message } from "../types/story";

const COMMENT_API = import.meta.env.VITE_API_URL + "storyComment";

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpecificComment: builder.query<CommentResponse, {storyId: string, commentId: string}>({
      query: ({storyId ,commentId}) => ({
        url: COMMENT_API + `/${storyId}/${commentId}`,
        method: "GET",
      }),
      providesTags: (result) => [{ type: 'Comment', id: result?.id }],
    }),
    getAllComments: builder.query<AllCommentResponse, string>({
      query: (storyId) => ({
        url: COMMENT_API + `/${storyId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: 'Comment', id: id }))
          : [{ type: 'Comment' }],
    }),
    createComment: builder.mutation<CommentResponse, {data: CommentRequest, storyId: string}>({
      query: ({data, storyId}) => ({
        url: COMMENT_API + `/${storyId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Comment'],
    }),
    createChapterComment: builder.mutation<CommentResponse, {data: CommentRequest, storyId: string, chapterId: string}>({
      query: ({data, storyId, chapterId}) => ({
        url: COMMENT_API + `/${storyId}/${chapterId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Comment'],
    }),
    updateComment: builder.mutation<CommentResponse, {data: CommentRequest, storyId: string, commentId: string}>({
      query: ({data, storyId, commentId}) => ({
        url: COMMENT_API + `/${storyId}/${commentId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result) => [{ type: 'Comment', id: result?.id }],
    }),
    deleteComment: builder.mutation<Message, {storyId: string, commentId: string}>({
      query: ({storyId, commentId}) => ({
        url: COMMENT_API + `/${storyId}/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Comment'],
    }),
  }),
});

export const {
  useGetAllCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetSpecificCommentQuery,
  useUpdateCommentMutation,
  useCreateChapterCommentMutation
} = commentApi;
