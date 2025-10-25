import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/notesRouter.js";
import authRouter from "./routes/authRouter.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/todos", router);

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== "test") {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log("Server started on PORT:", PORT);
    });
  });
}

export default app;