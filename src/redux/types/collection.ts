export interface Collection {
  id: string;
  userId: string;
  name: string;
  description: string;
  isPublic: boolean;
  isCollaborative: boolean;
  createdAt: string;
  updatedAt: string;
  storyCount?: number;
  stories?: any[];
  author?: { username: string };
}

export interface CreateCollectionData {
  name: string;
  description?: string;
  isPublic?: boolean;
  isCollaborative?: boolean;
}

export interface UpdateCollectionData {
  name?: string;
  description?: string;
  isPublic?: boolean;
  isCollaborative?: boolean;
}

export interface CollectionResponse {
  data: Collection[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}
