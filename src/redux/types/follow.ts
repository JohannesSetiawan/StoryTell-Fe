export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  followedAt: string;
}

export interface FollowerWithUser {
  id: string;
  followerId: string;
  followingId: string;
  followedAt: string;
  user: {
    id: string;
    username: string;
    description: string;
  };
}

export interface FollowingWithUser {
  id: string;
  followerId: string;
  followingId: string;
  followedAt: string;
  user: {
    id: string;
    username: string;
    description: string;
  };
}

export interface FollowStats {
  followersCount: number;
  followingCount: number;
}

export interface CheckFollowResponse {
  isFollowing: boolean;
}

export interface MessageResponse {
  message: string;
}

export enum ActivityType {
  NEW_STORY = 'new_story',
  NEW_CHAPTER = 'new_chapter',
  STATUS_CHANGE = 'status_change',
}

export interface ActivityFeed {
  id: string;
  userId: string;
  activityType: ActivityType;
  storyId?: string;
  chapterId?: string;
  metadata?: any;
  createdAt: string;
  user?: {
    id: string;
    username: string;
  };
  story?: {
    id: string;
    title: string;
  };
  chapter?: {
    id: string;
    title: string;
    order: number;
  };
}

export interface PaginatedActivityFeed {
  data: ActivityFeed[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export interface FeedQueryParams {
  page?: number;
  perPage?: number;
}
