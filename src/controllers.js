import bcrypt from "bcrypt";
import { z } from "zod";
import { createUser, getUserByEmail, getUserById } from "./queries.js";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const register = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await createUser(email, hashedPassword);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign({ id: user.id }, env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
};

export { register, login, registerSchema, getUser };
