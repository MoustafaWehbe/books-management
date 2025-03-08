import express from "express";
import cors from "cors";
import bookRoutes from "./routes/bookRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { initializeDatabase } from "./db";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/books", bookRoutes);

app.use(errorHandler);

initializeDatabase().catch(console.error);

export default app;
