import Expense from "../models/expenseModel.js";

const createExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const expenses = await Expense.find()
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const totalExpenses = await Expense.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]).then((res) => res[0]?.totalAmount || 0);

    const totalDocuments = await Expense.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);

    res.json({
      expenses,
      totalPages,
      totalExpenses,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createExpense, getExpenses, getExpense, updateExpense, deleteExpense };
