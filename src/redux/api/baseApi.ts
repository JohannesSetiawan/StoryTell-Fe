import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'

export const baseApi = createApi({
  tagTypes: [
    'Story',
    'Chapter',
    'Comment'
  ],
  baseQuery: fetchBaseQuery({
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    uselessApi: builder.query<void, void>({
      query: () => ({
        url: '/info',
        method: 'GET',
      }),
    }),
  }),
})
