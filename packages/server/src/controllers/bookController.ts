import { Request, Response } from "express";
import * as bookService from "../services/bookService";
import { Book } from "../models/Book";

export async function getBooks(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const filters: Partial<Book> = {};

    if (req.query.title) filters.title = req.query.title as string;
    if (req.query.author) filters.author = req.query.author as string;
    if (req.query.isbn) filters.isbn = req.query.isbn as string;

    const { books, total } = await bookService.getAllBooks(
      page,
      limit,
      filters
    );

    res.json({
      data: books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve books",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function getBook(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const book = await bookService.getBookById(id);

    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    res.json({ data: book });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve book",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function createBook(req: Request, res: Response): Promise<void> {
  try {
    const { title, author, isbn } = req.body;

    if (!title || !author || !isbn) {
      res.status(400).json({ error: "Title, author, and ISBN are required" });
      return;
    }

    const newBook = await bookService.createBook({ title, author, isbn });
    res.status(201).json({ data: newBook });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("UNIQUE constraint failed")
    ) {
      res.status(409).json({ error: "A book with this ISBN already exists" });
      return;
    }

    res.status(500).json({
      error: "Failed to create book",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function updateBook(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const { title, author, isbn } = req.body;

    const existingBook = await bookService.getBookById(id);
    if (!existingBook) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    const updatedBook = await bookService.updateBook(id, {
      title,
      author,
      isbn,
    });
    res.json({ data: updatedBook });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("UNIQUE constraint failed")
    ) {
      res.status(409).json({ error: "A book with this ISBN already exists" });
      return;
    }

    res.status(500).json({
      error: "Failed to update book",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function deleteBook(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);

    const existingBook = await bookService.getBookById(id);
    if (!existingBook) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    const success = await bookService.deleteBook(id);

    if (success) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: "Failed to delete book" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete book",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
