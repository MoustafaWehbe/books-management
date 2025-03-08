import { expect } from "chai";
import sinon from "sinon";
import * as bookService from "../src/services/bookService";
import * as bookController from "../src/controllers/bookController";
import { Book } from "../src/models/Book";

describe("Book Controller", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      params: {},
      query: {},
      body: {},
    };

    res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getBooks", () => {
    it("should return books with pagination", async () => {
      req.query = { page: "1", limit: "10" };
      const mockBooks: Book[] = [
        { id: 1, title: "Test Book 1", author: "Author 1", isbn: "1234567890" },
      ];
      const mockPagination = { page: 1, limit: 10, total: 1, pages: 1 };

      sinon.stub(bookService, "getAllBooks").resolves({
        books: mockBooks,
        total: 1,
      });

      await bookController.getBooks(req, res);

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0])
        .to.have.property("data")
        .that.deep.equals(mockBooks);
      expect(res.json.firstCall.args[0])
        .to.have.property("pagination")
        .that.includes({
          page: 1,
          limit: 10,
          total: 1,
        });
    });

    it("should handle errors gracefully", async () => {
      sinon
        .stub(bookService, "getAllBooks")
        .rejects(new Error("Database error"));

      await bookController.getBooks(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.have.property(
        "error",
        "Failed to retrieve books"
      );
    });
  });

  describe("getBook", () => {
    it("should return a single book when found", async () => {
      req.params.id = "1";
      const mockBook: Book = {
        id: 1,
        title: "Test Book",
        author: "Author",
        isbn: "1234567890",
      };

      sinon.stub(bookService, "getBookById").resolves(mockBook);

      await bookController.getBook(req, res);

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0])
        .to.have.property("data")
        .that.deep.equals(mockBook);
    });

    it("should return 404 when book not found", async () => {
      req.params.id = "999";
      sinon.stub(bookService, "getBookById").resolves(undefined);

      await bookController.getBook(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: "Book not found" })).to.be.true;
    });
  });

  describe("createBook", () => {
    it("should create a book with valid data", async () => {
      req.body = {
        title: "New Book",
        author: "New Author",
        isbn: "1234567890",
      };
      const createdBook = { id: 1, ...req.body };

      sinon.stub(bookService, "createBook").resolves(createdBook);

      await bookController.createBook(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ data: createdBook })).to.be.true;
    });

    it("should return 400 with missing required fields", async () => {
      req.body = { title: "New Book" }; // Missing author and ISBN

      await bookController.createBook(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.firstCall.args[0])
        .to.have.property("error")
        .that.includes("required");
    });

    it("should handle duplicate ISBN", async () => {
      req.body = {
        title: "New Book",
        author: "New Author",
        isbn: "1234567890",
      };
      const error = new Error("UNIQUE constraint failed: books.isbn");
      sinon.stub(bookService, "createBook").rejects(error);

      await bookController.createBook(req, res);

      expect(res.status.calledWith(409)).to.be.true;
      expect(res.json.firstCall.args[0])
        .to.have.property("error")
        .that.includes("already exists");
    });
  });

  describe("updateBook", () => {
    it("should update a book successfully", async () => {
      req.params.id = "1";
      req.body = { title: "Updated Title" };
      const existingBook = {
        id: 1,
        title: "Old Title",
        author: "Author",
        isbn: "1234567890",
      };
      const updatedBook = { ...existingBook, title: "Updated Title" };

      sinon.stub(bookService, "getBookById").resolves(existingBook);
      sinon.stub(bookService, "updateBook").resolves(updatedBook);

      await bookController.updateBook(req, res);

      expect(res.json.calledWith({ data: updatedBook })).to.be.true;
    });

    it("should return 404 when updating non-existent book", async () => {
      req.params.id = "999";
      req.body = { title: "Updated Title" };

      sinon.stub(bookService, "getBookById").resolves(undefined);

      await bookController.updateBook(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: "Book not found" })).to.be.true;
    });
  });

  describe("deleteBook", () => {
    it("should delete a book successfully", async () => {
      req.params.id = "1";
      const existingBook = {
        id: 1,
        title: "Title",
        author: "Author",
        isbn: "1234567890",
      };

      sinon.stub(bookService, "getBookById").resolves(existingBook);
      sinon.stub(bookService, "deleteBook").resolves(true);

      await bookController.deleteBook(req, res);

      expect(res.status.calledWith(204)).to.be.true;
    });

    it("should return 404 when deleting non-existent book", async () => {
      req.params.id = "999";

      sinon.stub(bookService, "getBookById").resolves(undefined);

      await bookController.deleteBook(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: "Book not found" })).to.be.true;
    });
  });
});
