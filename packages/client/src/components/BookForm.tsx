"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  CircularProgress,
} from "@mui/material";
import { Book } from "../types";

interface BookFormProps {
  open: boolean;
  book?: Book;
  onClose: () => void;
  onSubmit: (book: Book) => Promise<void>;
}

const initialBook: Book = {
  title: "",
  author: "",
  isbn: "",
};

export const BookForm: React.FC<BookFormProps> = ({
  open,
  book,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Book>(initialBook);
  const [errors, setErrors] = useState<Partial<Record<keyof Book, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData(book);
    } else {
      setFormData(initialBook);
    }
    setErrors({});
  }, [book, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof Book]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Book, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.author.trim()) {
      newErrors.author = "Author is required";
    }

    if (!formData.isbn.trim()) {
      newErrors.isbn = "ISBN is required";
    } else if (!/^[0-9-]{10,17}$/.test(formData.isbn.trim())) {
      newErrors.isbn = "ISBN format is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Failed to submit book:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{book?.id ? "Edit Book" : "Add New Book"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, my: 1 }}>
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
              required
            />
            <TextField
              name="author"
              label="Author"
              value={formData.author}
              onChange={handleChange}
              error={!!errors.author}
              helperText={errors.author}
              fullWidth
              required
            />
            <TextField
              name="isbn"
              label="ISBN"
              value={formData.isbn}
              onChange={handleChange}
              error={!!errors.isbn}
              helperText={
                errors.isbn || "Format: 10-17 digits with optional hyphens"
              }
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : book?.id ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
