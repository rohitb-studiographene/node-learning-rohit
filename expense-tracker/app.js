import express from "express";
import bodyParser from "body-parser";
import env from "./config/env.js";
import mongo from "./config/mongoose.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import validateExpense from "./middleware/validateExpense.js";
import validateAuth from "./middleware/validateAuth.js";
import validateAuthentication from "./middleware/validateAuthentication.js";

const app = express();

app.use(bodyParser.json());
mongo();

app.use("/api/auth", validateAuth, authRoutes);
app.use(
  "/api/expenses",
  validateAuthentication,
  validateExpense,
  expenseRoutes
);

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
