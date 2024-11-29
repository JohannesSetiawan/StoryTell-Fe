import { RatingRequest, SpecificRatingResponse, SpecificUserRatingResponse, StoryRatingResponse } from "../types/ratings";
import { baseApi } from "./baseApi";

const RATING_API = import.meta.env.VITE_API_URL + "rating";

export const ratingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRatingsForSpecificStory: builder.query<StoryRatingResponse, string>({
      query: (storyId) => ({
        url: RATING_API + `/story/${storyId}`,
        method: "GET",
      }),
      providesTags: (result) => [{ type: 'Rating', id: result?.storyId }],
    }),
    getSpecificUserRatingForStory: builder.query<SpecificUserRatingResponse, string>({
      query: (storyId) => ({
        url: RATING_API + `/${storyId}`,
        method: "GET",
      }),
      providesTags: (result) => [{ type: 'Rating', id: result?.storyId, authorId: result?.authorId }]
    }),
    createRating: builder.mutation<SpecificRatingResponse, {body: RatingRequest, storyId: string}>({
      query: ({body, storyId}) => ({
        url: RATING_API + `/${storyId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result) => [{ type: 'Rating', id: result?.storyId }],
    }),
    updateRating: builder.mutation<SpecificRatingResponse, {updateData: RatingRequest, ratingId: string}>({
      query: ({updateData, ratingId}) => ({
        url: RATING_API + `/${ratingId}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: (result) => [{ type: 'Rating', id: result?.storyId }, { type: 'Rating', id: result?.storyId, authorId: result?.authorId }],
    }),
    deleteStory: builder.mutation<SpecificRatingResponse, string>({
      query: (ratingId) => ({
        url: RATING_API + `/${ratingId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) => [{ type: 'Rating', id: result?.storyId }, { type: 'Rating', id: result?.storyId, authorId: result?.authorId }],
    }),
  }),
});

export const {
    useGetRatingsForSpecificStoryQuery,
    useGetSpecificUserRatingForStoryQuery,
    useCreateRatingMutation,
    useDeleteStoryMutation,
    useUpdateRatingMutation
} = ratingApi;
