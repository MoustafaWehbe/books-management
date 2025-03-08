import { Book } from "../models/Book";
import { getDatabase } from "../db";

export async function getAllBooks(
  page = 1,
  limit = 10,
  filters: Partial<Book> = {}
): Promise<{ books: Book[]; total: number }> {
  const db = await getDatabase();
  const offset = (page - 1) * limit;

  let whereClause = "";
  const params: any[] = [];

  if (Object.keys(filters).length > 0) {
    const conditions = [];

    if (filters.title) {
      conditions.push("title LIKE ?");
      params.push(`%${filters.title}%`);
    }

    if (filters.author) {
      conditions.push("author LIKE ?");
      params.push(`%${filters.author}%`);
    }

    if (filters.isbn) {
      conditions.push("isbn LIKE ?");
      params.push(`%${filters.isbn}%`);
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(" AND ")}`;
    }
  }

  const countQuery = `SELECT COUNT(*) as total FROM books ${whereClause}`;
  const { total } = await db.get(countQuery, ...params);

  const query = `
    SELECT * FROM books 
    ${whereClause} 
    ORDER BY id DESC 
    LIMIT ? OFFSET ?
  `;

  const books = await db.all(query, ...params, limit, offset);

  return { books, total };
}

export async function getBookById(id: number): Promise<Book | undefined> {
  const db = await getDatabase();
  return db.get<Book>("SELECT * FROM books WHERE id = ?", id);
}

export async function createBook(book: Book): Promise<Book> {
  const db = await getDatabase();
  const { title, author, isbn } = book;

  const result = await db.run(
    "INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)",
    title,
    author,
    isbn
  );

  return {
    id: result.lastID,
    title,
    author,
    isbn,
    created_at: new Date(),
    updated_at: new Date(),
  };
}

export async function updateBook(
  id: number,
  book: Partial<Book>
): Promise<Book | undefined> {
  const db = await getDatabase();
  const { title, author, isbn } = book;

  const updates: string[] = [];
  const values: any[] = [];

  if (title !== undefined) {
    updates.push("title = ?");
    values.push(title);
  }

  if (author !== undefined) {
    updates.push("author = ?");
    values.push(author);
  }

  if (isbn !== undefined) {
    updates.push("isbn = ?");
    values.push(isbn);
  }

  updates.push("updated_at = CURRENT_TIMESTAMP");

  if (updates.length > 0) {
    await db.run(
      `UPDATE books SET ${updates.join(", ")} WHERE id = ?`,
      ...values,
      id
    );
  }

  return getBookById(id);
}

export async function deleteBook(id: number): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.run("DELETE FROM books WHERE id = ?", id);
  return result.changes ? result.changes > 0 : false;
}
