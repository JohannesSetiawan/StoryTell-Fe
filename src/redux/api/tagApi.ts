import { baseApi } from "./baseApi";
import {
  Tag,
  CreateTagDto,
  UpdateTagDto,
  AssignTagsDto,
  PaginatedTagResponse,
  TagFilterParams,
  TagCategoriesResponse
} from "../types/tag";

const TAG_API = import.meta.env.VITE_API_URL + "tag";

export const tagApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Admin: Get all tags
    getAllTags: builder.query<PaginatedTagResponse, TagFilterParams>({
      query: ({ page = 1, limit = 50, name, category }) => {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        if (name) params.append('name', name);
        if (category) params.append('category', category);
        return {
          url: `${TAG_API}/admin/all?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Tag"],
    }),

    // Admin: Get tag categories
    getTagCategories: builder.query<TagCategoriesResponse, void>({
      query: () => ({
        url: `${TAG_API}/admin/categories`,
        method: "GET",
      }),
      providesTags: ["Tag"],
    }),

    // Admin: Get tag by ID
    getTagById: builder.query<Tag, string>({
      query: (id) => ({
        url: `${TAG_API}/admin/${id}`,
        method: "GET",
      }),
      providesTags: (result) => [{ type: 'Tag', id: result?.id }],
    }),

    // Admin: Create tag
    createTag: builder.mutation<Tag, CreateTagDto>({
      query: (body) => ({
        url: `${TAG_API}/admin`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tag"],
    }),

    // Admin: Update tag
    updateTag: builder.mutation<Tag, { id: string; data: UpdateTagDto }>({
      query: ({ id, data }) => ({
        url: `${TAG_API}/admin/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result) => [{ type: 'Tag', id: result?.id }, "Tag"],
    }),

    // Admin: Delete tag
    deleteTag: builder.mutation<Tag, string>({
      query: (id) => ({
        url: `${TAG_API}/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tag"],
    }),

    // User: Get story tags
    getStoryTags: builder.query<Tag[], string>({
      query: (storyId) => ({
        url: `${TAG_API}/story/${storyId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, storyId) => [{ type: 'Story', id: storyId }],
    }),

    // User: Assign tags to story
    assignTagsToStory: builder.mutation<{ message: string }, { storyId: string; data: AssignTagsDto }>({
      query: ({ storyId, data }) => ({
        url: `${TAG_API}/story/${storyId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { storyId }) => [{ type: 'Story', id: storyId }],
    }),

    // User: Remove specific tag from story
    removeTagFromStory: builder.mutation<{ message: string }, { storyId: string; tagId: string }>({
      query: ({ storyId, tagId }) => ({
        url: `${TAG_API}/story/${storyId}/tag/${tagId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { storyId }) => [{ type: 'Story', id: storyId }],
    }),

    // User: Remove all tags from story
    removeAllTagsFromStory: builder.mutation<{ message: string }, string>({
      query: (storyId) => ({
        url: `${TAG_API}/story/${storyId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, storyId) => [{ type: 'Story', id: storyId }],
    }),
  }),
});

export const {
  useGetAllTagsQuery,
  useGetTagCategoriesQuery,
  useGetTagByIdQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useGetStoryTagsQuery,
  useAssignTagsToStoryMutation,
  useRemoveTagFromStoryMutation,
  useRemoveAllTagsFromStoryMutation,
} = tagApi;
