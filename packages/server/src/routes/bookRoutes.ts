import { Router } from "express";
import * as bookController from "../controllers/bookController";

const router = Router();

router.get("/", bookController.getBooks);
router.get("/:id", bookController.getBook);
router.post("/", bookController.createBook);
router.put("/:id", bookController.updateBook);
router.delete("/:id", bookController.deleteBook);

export default router;
