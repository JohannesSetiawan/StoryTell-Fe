import { baseApi } from "./baseApi";
import { Collection, CollectionResponse, CreateCollectionData, UpdateCollectionData } from "../types/collection";

const COLLECTION_API = import.meta.env.VITE_API_URL + "collection";

type pagination = {
  page: number;
  perPage: number;
}

export const collectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserCollections: builder.query<CollectionResponse, pagination>({
      query: ({ page, perPage }) => ({
        url: COLLECTION_API + `?page=${page}&perPage=${perPage}`,
        method: "GET",
      }),
      providesTags: ['Collection'],
    }),
    getDiscoverCollections: builder.query<CollectionResponse, pagination>({
      query: ({ page, perPage }) => ({
        url: COLLECTION_API + `/discover?page=${page}&perPage=${perPage}`,
        method: "GET",
      }),
      providesTags: ['Collection'],
    }),
    getUserPublicCollections: builder.query<CollectionResponse, { username: string } & pagination>({
      query: ({ username, page, perPage }) => ({
        url: COLLECTION_API + `/user/${username}?page=${page}&perPage=${perPage}`,
        method: "GET",
      }),
      providesTags: ['Collection'],
    }),
    getCollection: builder.query<Collection, string>({
      query: (id) => ({
        url: COLLECTION_API + `/${id}`,
        method: "GET",
      }),
      providesTags: (result) => [{ type: 'Collection', id: result?.id }],
    }),
    createCollection: builder.mutation<Collection, CreateCollectionData>({
      query: (body) => ({
        url: COLLECTION_API,
        method: "POST",
        body,
      }),
      invalidatesTags: ['Collection'],
    }),
    updateCollection: builder.mutation<Collection, { id: string; data: UpdateCollectionData }>({
      query: ({ id, data }) => ({
        url: COLLECTION_API + `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result) => [{ type: 'Collection', id: result?.id }],
    }),
    deleteCollection: builder.mutation<void, string>({
      query: (id) => ({
        url: COLLECTION_API + `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Collection'],
    }),
    addStoryToCollection: builder.mutation<void, { collectionId: string; storyId: string }>({
      query: ({ collectionId, storyId }) => ({
        url: COLLECTION_API + `/${collectionId}/story/${storyId}`,
        method: "POST",
      }),
      invalidatesTags: (..._args: any[]) => {
        const { collectionId } = _args[2] || {};
        return [{ type: 'Collection', id: collectionId }];
      },
    }),
    removeStoryFromCollection: builder.mutation<void, { collectionId: string; storyId: string }>({
      query: ({ collectionId, storyId }) => ({
        url: COLLECTION_API + `/${collectionId}/story/${storyId}`,
        method: "DELETE",
      }),
      invalidatesTags: (..._args: any[]) => {
        const { collectionId } = _args[2] || {};
        return [{ type: 'Collection', id: collectionId }];
      },
    }),
  }),
});

export const {
  useGetUserCollectionsQuery,
  useGetDiscoverCollectionsQuery,
  useGetUserPublicCollectionsQuery,
  useGetCollectionQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
  useAddStoryToCollectionMutation,
  useRemoveStoryFromCollectionMutation,
} = collectionApi;
