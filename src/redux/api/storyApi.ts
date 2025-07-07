import { baseApi } from "./baseApi";
import { Message, Story, allStoriesResponse, createStoryData, specificStoryResponse } from "../types/story";

const STORY_API = import.meta.env.VITE_API_URL + "story";

type pagination = {
  page: number,
  perPage: number,
  search?: string,
  sort?: string
}

export const storyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpecificStory: builder.query<specificStoryResponse, string>({
      query: (storyId) => ({
        url: STORY_API + `/${storyId}`,
        method: "GET",
      }),
      providesTags: (result) => [{ type: 'Story', id: result?.id }],
    }),
    getAllStories: builder.query<allStoriesResponse, pagination>({
      query: ({page, perPage, search, sort}) => ({
        url: STORY_API + `?page=${page}&perPage=${perPage}` + (search ? `&search=${search}` : '') + (sort ? `&sort=${sort}` : ''),
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? result.data.map(({ id }) => ({ type: 'Story', id: id }))
          : [{ type: 'Story' }],
    }),
    getSpecificUserStory: builder.query<allStoriesResponse, {userId: string} & pagination>({
      query: ({userId, page, perPage, search, sort}) => ({
        url: STORY_API + `/user/${userId}?page=${page}&perPage=${perPage}` + (search ? `&search=${search}` : '') + (sort ? `&sort=${sort}` : ''),
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? result.data.map(({ id }) => ({ type: 'Story', id: id }))
          : [{ type: 'Story' }],
    }),
    createStory: builder.mutation<Story, createStoryData>({
      query: (body) => ({
        url: STORY_API,
        method: "POST",
        body,
      }),
      invalidatesTags: ['Story'],
    }),
    updateStory: builder.mutation<Story, {updateData: createStoryData, storyId: string}>({
      query: ({updateData, storyId}) => ({
        url: STORY_API + `/${storyId}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: (result) => [{ type: 'Story', id: result?.id }, 'Story'],
    }),
    deleteStory: builder.mutation<Message, string>({
      query: (storyId) => ({
        url: STORY_API + `/${storyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Story'],
    }),
  }),
});

export const {
  useGetAllStoriesQuery,
  useCreateStoryMutation,
  useDeleteStoryMutation,
  useGetSpecificStoryQuery,
  useGetSpecificUserStoryQuery,
  useUpdateStoryMutation
} = storyApi;
