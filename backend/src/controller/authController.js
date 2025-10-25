import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "Thisisasecretman!!";

export const signUp = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to MongoDB
    const user = await User.create({ 
      email, 
      password: hashedPassword 
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: "1h" }
    );

    // Set httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure in production
      sameSite: "lax",
      maxAge: 3600000, // 1 hour
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// POST /signin -> { token }
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    // Find user in MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: "1h" }
    );

    // Set httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600000, // 1 hour
    });

    res.json({ token });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error during signin" });
  }
};

// POST /logout -> {}
export const logout = async (req, res) => {
  // Clear the cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  
  res.json({});
};

// GET /verify - Check if user is authenticated
export const verifyAuth = async (req, res) => {
  try {
    res.json({ 
      token: req.cookies.token,
      user: { 
        id: req.user.id, 
        email: req.user.email 
      }
    });
  } catch (error) {
    res.status(401).json({ message: "Not authenticated" });
  }
};