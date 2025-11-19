import { baseApi } from './baseApi';
import {
  Follow,
  FollowerWithUser,
  FollowingWithUser,
  FollowStats,
  CheckFollowResponse,
  MessageResponse,
  PaginatedActivityFeed,
  FeedQueryParams,
} from '../types/follow';

const FOLLOW_API = import.meta.env.VITE_API_URL + 'follow';

export const followApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    followUser: builder.mutation<Follow, string>({
      query: (userId) => ({
        url: `${FOLLOW_API}/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['UserProfile'],
    }),
    unfollowUser: builder.mutation<MessageResponse, string>({
      query: (userId) => ({
        url: `${FOLLOW_API}/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserProfile'],
    }),
    getFollowers: builder.query<FollowerWithUser[], void>({
      query: () => ({
        url: `${FOLLOW_API}/followers`,
        method: 'GET',
      }),
      providesTags: ['UserProfile'],
    }),
    getFollowing: builder.query<FollowingWithUser[], void>({
      query: () => ({
        url: `${FOLLOW_API}/following`,
        method: 'GET',
      }),
      providesTags: ['UserProfile'],
    }),
    checkIfFollowing: builder.query<CheckFollowResponse, string>({
      query: (userId) => ({
        url: `${FOLLOW_API}/check/${userId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, userId) => [
        { type: 'UserProfile', id: userId },
      ],
    }),
    getFollowStats: builder.query<FollowStats, string>({
      query: (userId) => ({
        url: `${FOLLOW_API}/stats/${userId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, userId) => [
        { type: 'UserProfile', id: `stats-${userId}` },
      ],
    }),
    getActivityFeed: builder.query<PaginatedActivityFeed, FeedQueryParams>({
      query: ({ page = 1, perPage = 20 }) => ({
        url: `${FOLLOW_API}/feed?page=${page}&perPage=${perPage}`,
        method: 'GET',
      }),
      providesTags: ['UserProfile'],
    }),
  }),
});

export const {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
  useCheckIfFollowingQuery,
  useGetFollowStatsQuery,
  useGetActivityFeedQuery,
} = followApi;
