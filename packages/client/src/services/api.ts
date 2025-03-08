import axios from "axios";
import { Book, ApiResponse } from "../types";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const bookService = {
  getBooks: async (
    page = 1,
    limit = 10,
    filters: Partial<Book> = {}
  ): Promise<ApiResponse<Book[]>> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (filters.title) params.append("title", filters.title);
    if (filters.author) params.append("author", filters.author);
    if (filters.isbn) params.append("isbn", filters.isbn);

    const response = await api.get<ApiResponse<Book[]>>(
      `/books?${params.toString()}`
    );
    return response.data;
  },

  getBook: async (id: number): Promise<ApiResponse<Book>> => {
    const response = await api.get<ApiResponse<Book>>(`/books/${id}`);
    return response.data;
  },

  createBook: async (book: Book): Promise<ApiResponse<Book>> => {
    const response = await api.post<ApiResponse<Book>>("/books", book);
    return response.data;
  },

  updateBook: async (
    id: number,
    book: Partial<Book>
  ): Promise<ApiResponse<Book>> => {
    const response = await api.put<ApiResponse<Book>>(`/books/${id}`, book);
    return response.data;
  },

  deleteBook: async (id: number): Promise<void> => {
    await api.delete(`/books/${id}`);
  },
};
