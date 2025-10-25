import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "Thisisasecretman!!";

export const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};