import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const validateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.replace("Bearer ", "");
    console.log(token);
    const decoded = jwt.verify(token, env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
