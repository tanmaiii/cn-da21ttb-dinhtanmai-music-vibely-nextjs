export interface ListResponse<T> {
  data: T[];
  sort: "newest" | "oldest" | "mostLikes" | "mostListens";
  keyword: string;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  limit: number;
}

export interface ResponseAPI<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: ISort;
  keyword?: string;
}

export type ISort = "newest" | "oldest" | "mostLikes" | "mostListens";