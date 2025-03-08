import request from "supertest";
import { expect } from "chai";
import app from "../src/app";
import { initializeDatabase, getDatabase } from "../src/db";
import path from "path";
import fs from "fs";

describe("API Integration Tests", () => {
  let testDbPath: string;
  let apiBooks: any[] = [];

  before(async () => {
    testDbPath = path.resolve(__dirname, "../test-database.sqlite");

    process.env.DB_PATH = testDbPath;

    await initializeDatabase();
    const db = await getDatabase();
    await db.run("DELETE FROM books");

    await db.run(
      "INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)",
      "Test Book 1",
      "Test Author 1",
      "1111111111"
    );

    await db.run(
      "INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)",
      "Test Book 2",
      "Test Author 2",
      "2222222222"
    );
  });

  after(async () => {
    try {
      if (fs.existsSync(testDbPath)) {
        fs.unlinkSync(testDbPath);
      }
    } catch (err) {
      console.error("Error cleaning up test database:", err);
    }
  });

  describe("GET /api/books", () => {
    it("should return a list of books", async () => {
      const response = await request(app)
        .get("/api/books")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).to.have.property("data").that.is.an("array");
      expect(response.body.data.length).to.be.at.least(2);
      expect(response.body).to.have.property("pagination");

      apiBooks = response.body.data;
    });

    it("should filter books by title", async () => {
      const response = await request(app)
        .get("/api/books?title=Test Book 1")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.data).to.be.an("array");
      expect(response.body.data.length).to.equal(1);
      expect(response.body.data[0].title).to.equal("Test Book 1");
    });

    it("should paginate results", async () => {
      const response = await request(app)
        .get("/api/books?page=1&limit=1")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.data).to.be.an("array");
      expect(response.body.data.length).to.equal(1);
      expect(response.body.pagination.page).to.equal(1);
      expect(response.body.pagination.limit).to.equal(1);
      expect(response.body.pagination.total).to.be.at.least(2);
    });
  });

  describe("GET /api/books/:id", () => {
    it("should return a single book by id", async () => {
      const bookId = apiBooks[0].id;

      const response = await request(app)
        .get(`/api/books/${bookId}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).to.have.property("data");
      expect(response.body.data).to.have.property("id", bookId);
      expect(response.body.data).to.have.property("title");
      expect(response.body.data).to.have.property("author");
      expect(response.body.data).to.have.property("isbn");
    });

    it("should return 404 for non-existent book", async () => {
      await request(app)
        .get("/api/books/9999")
        .expect("Content-Type", /json/)
        .expect(404);
    });
  });

  describe("POST /api/books", () => {
    it("should create a new book", async () => {
      const newBook = {
        title: "Integration Test Book",
        author: "Test Author",
        isbn: "3333333333",
      };

      const response = await request(app)
        .post("/api/books")
        .send(newBook)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(response.body).to.have.property("data");
      expect(response.body.data).to.have.property("id");
      expect(response.body.data).to.have.property("title", newBook.title);
      expect(response.body.data).to.have.property("author", newBook.author);
      expect(response.body.data).to.have.property("isbn", newBook.isbn);

      apiBooks.push(response.body.data);
    });

    it("should validate required fields", async () => {
      await request(app)
        .post("/api/books")
        .send({ title: "Incomplete Book" })
        .expect("Content-Type", /json/)
        .expect(400);
    });

    it("should prevent duplicate ISBNs", async () => {
      await request(app)
        .post("/api/books")
        .send({
          title: "Duplicate ISBN Book",
          author: "Another Test Author",
          isbn: "3333333333",
        })
        .expect("Content-Type", /json/)
        .expect(409);
    });
  });

  describe("PUT /api/books/:id", () => {
    it("should update an existing book", async () => {
      const bookId = apiBooks[0].id;
      const updates = {
        title: "Updated Integration Test Book",
      };

      const response = await request(app)
        .put(`/api/books/${bookId}`)
        .send(updates)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).to.have.property("data");
      expect(response.body.data).to.have.property("id", bookId);
      expect(response.body.data).to.have.property("title", updates.title);
    });

    it("should return 404 for updating non-existent book", async () => {
      await request(app)
        .put("/api/books/9999")
        .send({ title: "Should Not Update" })
        .expect("Content-Type", /json/)
        .expect(404);
    });
  });

  describe("DELETE /api/books/:id", () => {
    it("should delete an existing book", async () => {
      const bookToDelete = apiBooks[apiBooks.length - 1];

      await request(app).delete(`/api/books/${bookToDelete.id}`).expect(204);

      await request(app).get(`/api/books/${bookToDelete.id}`).expect(404);
    });

    it("should return 404 for deleting non-existent book", async () => {
      await request(app)
        .delete("/api/books/9999")
        .expect("Content-Type", /json/)
        .expect(404);
    });
  });
});
