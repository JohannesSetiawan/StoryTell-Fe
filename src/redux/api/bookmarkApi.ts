import { baseApi } from "./baseApi";
import { 
  PaginatedBookmarkResponse, 
  CreateBookmarkRequest, 
  DeleteBookmarkRequest, 
  MessageResponse,
  BookmarkStatusResponse
} from "../types/bookmark";

const BOOKMARK_API = import.meta.env.VITE_API_URL + "bookmark";

type Pagination = {
  page: number;
  perPage: number;
}

export const bookmarkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBookmarks: builder.query<PaginatedBookmarkResponse, Pagination>({
      query: ({page, perPage}) => ({
        url: BOOKMARK_API + `?page=${page}&perPage=${perPage}`,
        method: "GET",
      }),
      providesTags: ['Bookmark'],
    }),
    createBookmark: builder.mutation<MessageResponse, CreateBookmarkRequest>({
      query: (body) => ({
        url: BOOKMARK_API,
        method: "POST",
        body,
      }),
      invalidatesTags: ['Bookmark'],
    }),
    deleteBookmark: builder.mutation<MessageResponse, DeleteBookmarkRequest>({
      query: (body) => ({
        url: BOOKMARK_API,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ['Bookmark'],
    }),
    checkBookmarkStatus: builder.query<BookmarkStatusResponse, string>({
      query: (storyId) => ({
        url: BOOKMARK_API + `/check/${storyId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, storyId) => [{ type: 'Bookmark', id: storyId }],
    }),
  }),
});

export const {
  useGetAllBookmarksQuery,
  useCreateBookmarkMutation,
  useDeleteBookmarkMutation,
  useCheckBookmarkStatusQuery,
} = bookmarkApi;
