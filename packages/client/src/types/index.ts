export interface Book {
  id?: number;
  title: string;
  author: string;
  isbn: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationData;
  error?: string;
  details?: string;
}
