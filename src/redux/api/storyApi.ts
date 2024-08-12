import { baseApi } from "./baseApi";
import { Message, Story, allStoriesResponse, createStoryData, specificStoryResponse } from "../types/story";

const STORY_API = import.meta.env.VITE_API_URL + "story";

export const storyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpecificStory: builder.query<specificStoryResponse, string>({
      query: (storyId) => ({
        url: STORY_API + `/${storyId}`,
        method: "GET",
      }),
      providesTags: (result) => [{ type: 'Story', id: result?.id }],
    }),
    getAllStories: builder.query<allStoriesResponse, void>({
      query: () => ({
        url: STORY_API,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: 'Story', id: id }))
          : [{ type: 'Story' }],
    }),
    getSpecificUserStory: builder.query<allStoriesResponse, string>({
      query: (userId) => ({
        url: STORY_API + `/user/${userId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: 'Story', id: id }))
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
