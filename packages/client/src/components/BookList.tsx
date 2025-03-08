"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Book, PaginationData } from "../types";

interface BookListProps {
  books: Book[];
  pagination: PaginationData;
  loading: boolean;
  filters: Partial<Book>;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onFilterChange: (filters: Partial<Book>) => void;
  onAddClick: () => void;
  onEditClick: (book: Book) => void;
  onDeleteClick: (book: Book) => void;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  pagination,
  loading,
  filters,
  onPageChange,
  onRowsPerPageChange,
  onFilterChange,
  onAddClick,
  onEditClick,
  onDeleteClick,
}) => {
  const [searchValues, setSearchValues] = useState({
    title: filters.title || "",
    author: filters.author || "",
    isbn: filters.isbn || "",
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    book?: Book;
  }>({
    open: false,
  });

  const handleSearch = () => {
    const newFilters: Partial<Book> = {};

    if (searchValues.title) newFilters.title = searchValues.title;
    if (searchValues.author) newFilters.author = searchValues.author;
    if (searchValues.isbn) newFilters.isbn = searchValues.isbn;

    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setSearchValues({
      title: "",
      author: "",
      isbn: "",
    });
    onFilterChange({});
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const openDeleteDialog = (book: Book) => {
    setDeleteDialog({ open: true, book });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false });
  };

  const confirmDelete = () => {
    if (deleteDialog.book) {
      onDeleteClick(deleteDialog.book);
      closeDeleteDialog();
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ mb: 2, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5">Books</Typography>
          <Button variant="contained" color="primary" onClick={onAddClick}>
            Add Book
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
          <TextField
            name="title"
            label="Title"
            size="small"
            value={searchValues.title}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="author"
            label="Author"
            size="small"
            value={searchValues.author}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="isbn"
            label="ISBN"
            size="small"
            value={searchValues.isbn}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" color="primary" onClick={handleSearch}>
              Search
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClearFilters}
              disabled={!Object.values(filters).some(Boolean)}
            >
              Clear
            </Button>
          </Box>
        </Box>

        {Object.values(filters).some(Boolean) && (
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            {filters.title && (
              <Chip
                label={`Title: ${filters.title}`}
                onDelete={() =>
                  onFilterChange({ ...filters, title: undefined })
                }
              />
            )}
            {filters.author && (
              <Chip
                label={`Author: ${filters.author}`}
                onDelete={() =>
                  onFilterChange({ ...filters, author: undefined })
                }
              />
            )}
            {filters.isbn && (
              <Chip
                label={`ISBN: ${filters.isbn}`}
                onDelete={() => onFilterChange({ ...filters, isbn: undefined })}
              />
            )}
          </Box>
        )}

        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>ISBN</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress size={40} sx={{ my: 2 }} />
                  </TableCell>
                </TableRow>
              ) : books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      {Object.values(filters).some(Boolean)
                        ? "No books match your search criteria"
                        : "No books available. Add your first book!"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.isbn}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEditClick(book)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => openDeleteDialog(book)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          rowsPerPage={pagination.limit}
          onPageChange={(_, page) => onPageChange(page + 1)}
          onRowsPerPageChange={(e) =>
            onRowsPerPageChange(parseInt(e.target.value, 10))
          }
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      <Dialog open={deleteDialog.open} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &quot;{deleteDialog.book?.title}
            &quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
