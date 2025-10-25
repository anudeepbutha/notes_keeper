import express from "express";
import { signUp, signIn, logout, verifyAuth } from "../controller/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/logout", authenticate, logout);
router.get("/verify", authenticate, verifyAuth);
export default router;