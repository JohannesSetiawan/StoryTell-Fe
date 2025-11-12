export interface Tag {
  id: string;
  name: string;
  category: string;
  dateCreated: string;
}

export interface CreateTagDto {
  name: string;
  category: string;
}

export interface UpdateTagDto {
  name?: string;
  category?: string;
}

export interface AssignTagsDto {
  tagIds: string[];
}

export interface PaginatedTagResponse {
  data: Tag[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TagFilterParams {
  page?: number;
  limit?: number;
  name?: string;
  category?: string;
}

export interface TagCategoriesResponse {
  categories: string[];
}
