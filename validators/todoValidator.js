const { z } = require("zod");

const todoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  completed: z.boolean().optional(),
});

module.exports = { todoSchema };
