import { baseApi } from "./baseApi";

const ADMIN_API = import.meta.env.VITE_API_URL + "admin";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  description: string | null;
  dateCreated: Date;
  isAdmin: boolean;
}

export interface AdminStory {
  id: string;
  title: string;
  description: string | null;
  dateCreated: Date;
  authorId: string;
  isprivate: boolean;
  chapters: any[];
  author: {
    username: string;
  };
  tags?: string[];
}

export interface AdminChapter {
  id: string;
  title: string;
  content: string;
  dateCreated: Date;
  storyId: string;
  order: number;
  story: {
    title: string;
    author: {
      username: string;
      id: string;
    };
  };
}

export interface AdminComment {
  id: string;
  content: string;
  dateCreated: Date;
  authorId: string;
  chapterId: string | null;
  storyId: string;
  parentId: string | null;
  authorUsername: string;
  storyTitle: string;
  chapterTitle: string | null;
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface UserFilterParams extends PaginationParams {
  username?: string;
  isAdmin?: boolean;
}

export interface StoryFilterParams extends PaginationParams {
  title?: string;
  author?: string;
  isPrivate?: boolean;
}

export interface ChapterFilterParams extends PaginationParams {
  story?: string;
  author?: string;
  content?: string;
}

export interface CommentFilterParams extends PaginationParams {
  content?: string;
  author?: string;
  story?: string;
  chapter?: string;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Users
    getAllUsers: builder.query<PaginatedResponse<AdminUser>, UserFilterParams>({
      query: ({ page = 1, limit = 10, username, isAdmin }) => {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        if (username) params.append('username', username);
        if (isAdmin !== undefined) params.append('isAdmin', isAdmin.toString());
        return {
          url: `${ADMIN_API}/user?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["UserProfile"],
    }),

    // Stories
    getAllStoriesAdmin: builder.query<PaginatedResponse<AdminStory>, StoryFilterParams>({
      query: ({ page = 1, limit = 10, title, author, isPrivate }) => {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        if (title) params.append('title', title);
        if (author) params.append('author', author);
        if (isPrivate !== undefined) params.append('isPrivate', isPrivate.toString());
        return {
          url: `${ADMIN_API}/story?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Story"],
    }),

    // Chapters
    getAllChaptersAdmin: builder.query<PaginatedResponse<AdminChapter>, ChapterFilterParams>({
      query: ({ page = 1, limit = 10, story, author, content }) => {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        if (story) params.append('story', story);
        if (author) params.append('author', author);
        if (content) params.append('content', content);
        return {
          url: `${ADMIN_API}/chapter?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Chapter"],
    }),

    // Comments
    getAllCommentsAdmin: builder.query<PaginatedResponse<AdminComment>, CommentFilterParams>({
      query: ({ page = 1, limit = 10, content, author, story, chapter }) => {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        if (content) params.append('content', content);
        if (author) params.append('author', author);
        if (story) params.append('story', story);
        if (chapter) params.append('chapter', chapter);
        return {
          url: `${ADMIN_API}/comment?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Comment"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetAllStoriesAdminQuery,
  useGetAllChaptersAdminQuery,
  useGetAllCommentsAdminQuery,
} = adminApi;
