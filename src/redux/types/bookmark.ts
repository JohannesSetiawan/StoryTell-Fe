export interface BookmarkItem {
  storyId: string;
  title: string;
  authorName: string;
  storyStatus: string;
  latestChapter: string | null;
}

export interface PaginatedBookmarkResponse {
  data: BookmarkItem[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export interface CreateBookmarkRequest {
  storyId: string;
}

export interface DeleteBookmarkRequest {
  storyId: string;
}

export interface MessageResponse {
  message: string;
}

export interface BookmarkStatusResponse {
  isBookmarked: boolean;
}
