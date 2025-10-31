import express from "express";
import { signUp, signIn, logout, verifyAuth } from "../controller/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/logout", authenticate, logout);
authRouter.get("/verify", authenticate, verifyAuth);
export default authRouter;