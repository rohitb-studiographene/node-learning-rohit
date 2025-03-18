import express from "express";
import * as Auth from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", Auth.signup);
router.post("/login", Auth.login);

export default router;
