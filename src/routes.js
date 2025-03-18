import { Router } from "express";
import { register, login, getUser } from "./controllers.js";
import { validateToken } from "../middlewares/validateToken.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile/:id", validateToken, getUser);

export default router;
