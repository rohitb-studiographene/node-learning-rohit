import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { UserModel } from "../models/user.model.js";
import env from "../config/env.js";

export const register = async (req, res) => {
  try {
    const userData = registerSchema.parse(req.body);

    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await UserModel.create({
      ...userData,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user.id }, env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const credentials = loginSchema.parse(req.body);

    const user = await UserModel.findByEmail(credentials.email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(
      credentials.password,
      user.password
    );
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
};
