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
  status: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest" | "mostLikes" | "mostListens";
  keyword?: string;
}
