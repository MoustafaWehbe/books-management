import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";

let db: Database;

export async function initializeDatabase(): Promise<Database> {
  if (!db) {
    db = await open({
      filename: path.resolve(__dirname, "../database.sqlite"),
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isbn TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  return db;
}

export async function getDatabase(): Promise<Database> {
  if (!db) {
    return initializeDatabase();
  }
  return db;
}
