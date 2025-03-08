"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BookList } from "@/components/BookList";
import { BookForm } from "@/components/BookForm";
import { ErrorAlert } from "@/components/ErrorAlert";
import { bookService } from "@/services/api";
import { Book, PaginationData } from "@/types";

const initialPagination: PaginationData = {
  page: 1,
  limit: 10,
  total: 0,
  pages: 0,
};

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] =
    useState<PaginationData>(initialPagination);
  const [filters, setFilters] = useState<Partial<Book>>({});
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await bookService.getBooks(
        pagination.page,
        pagination.limit,
        filters
      );
      setBooks(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setError("Failed to fetch books. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleRowsPerPageChange = (limit: number) => {
    setPagination((prev) => ({ ...prev, page: 1, limit }));
  };

  const handleFilterChange = (newFilters: Partial<Book>) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleAddClick = () => {
    setSelectedBook(undefined);
    setFormOpen(true);
  };

  const handleEditClick = (book: Book) => {
    setSelectedBook(book);
    setFormOpen(true);
  };

  const handleDeleteClick = async (book: Book) => {
    try {
      if (book.id) {
        await bookService.deleteBook(book.id);
        fetchBooks();
      }
    } catch (err) {
      console.error("Failed to delete book:", err);
      setError("Failed to delete book. Please try again later.");
    }
  };

  const handleFormSubmit = async (book: Book) => {
    try {
      if (selectedBook?.id) {
        await bookService.updateBook(selectedBook.id, book);
      } else {
        await bookService.createBook(book);
      }
      fetchBooks();
    } catch (err) {
      console.error("Failed to save book:", err);
      setError("Failed to save book. Please try again later.");
      throw err;
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const handleErrorClose = () => {
    setError(null);
  };

  return (
    <>
      <BookList
        books={books}
        pagination={pagination}
        loading={loading}
        filters={filters}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onFilterChange={handleFilterChange}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />
      <BookForm
        open={formOpen}
        book={selectedBook}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
      <ErrorAlert
        open={!!error}
        message={error || ""}
        onClose={handleErrorClose}
      />
    </>
  );
};

export default App;
