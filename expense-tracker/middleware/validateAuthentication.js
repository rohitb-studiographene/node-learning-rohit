// how to check if the user is authenticated or not

import jwt from "jsonwebtoken";

import env from "../config/env.js";

const validateAuthentication = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    jwt.verify(token, env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized user" });
  }
};

export default validateAuthentication;
