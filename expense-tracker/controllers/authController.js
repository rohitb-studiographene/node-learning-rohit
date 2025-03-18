import Auth from "../models/authModel.js";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await Auth.create({ ...req.body, password: hashedPassword });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await Auth.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid password" });
    const token = jwt.sign({ id: user._id }, env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
