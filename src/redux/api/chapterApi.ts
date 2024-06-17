import { CreateChapterData } from "../types/chapter";
import { Chapter, Message } from "../types/story";
import { baseApi } from "./baseApi";

const CHAPTER_API = "https://story-tell-be.vercel.app/chapter";

export const chapterApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      getSpecificChapter: builder.query<Chapter, string>({
        query: (storyId) => ({
          url: CHAPTER_API + `/${storyId}`,
          method: "GET",
        }),
        providesTags: (result) => [{ type: 'Chapter', id: result?.id }],
      }),
      createChapter: builder.mutation<Chapter, CreateChapterData>({
        query: (body) => ({
          url: CHAPTER_API,
          method: "POST",
          body,
        }),
        invalidatesTags: ['Chapter', 'Story'],
      }),
      updateChapter: builder.mutation<Chapter, {updateData: CreateChapterData, chapterId: string}>({
        query: ({updateData, chapterId}) => ({
          url: CHAPTER_API + `/${chapterId}`,
          method: "PUT",
          body: updateData,
        }),
        invalidatesTags: (result) => [{ type: 'Chapter', id: result?.id }, 'Chapter'],
      }),
      deleteChapter: builder.mutation<Message, string>({
        query: (chapterId) => ({
          url: CHAPTER_API + `/${chapterId}`,
          method: "DELETE",
        }),
        invalidatesTags: ['Chapter', 'Story'],
      }),
    }),
  });
  
export const {
    useCreateChapterMutation,
    useDeleteChapterMutation,
    useGetSpecificChapterQuery,
    useUpdateChapterMutation
} = chapterApi;
  