import express from "express";
import * as Expense from "../controllers/expensesController.js";

const router = express.Router();

router.post("/", Expense.createExpense);
router.get("/", Expense.getExpenses);
router.get("/:id", Expense.getExpense);
router.put("/:id", Expense.updateExpense);
router.delete("/:id", Expense.deleteExpense);

export default router;
