import { z } from "zod";

const expenseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .optional(),
  amount: z.number().positive("Amount must be greater than 0").optional(),
  createdAt: z.date().optional(), // Optional since it defaults to Date.now()
});

const validateExpense = (req, res, next) => {
  try {
    req.body = expenseSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }
};

export default validateExpense;
