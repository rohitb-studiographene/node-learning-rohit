const Todo = require("../models/Todo");
const { todoSchema } = require("../validators/todoValidator");

let todos = [];

exports.getTodos = (req, res) => {
  res.json(todos);
};

exports.getTodo = (req, res) => {
  const todo = todos.find((todo) => todo.id === req.params.id);
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json(todo);
};

exports.createTodo = (req, res) => {
  try {
    const parsedData = todoSchema.parse(req.body);
    const newTodo = new Todo(parsedData.title, parsedData.completed);
    todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.errors || err.message });
  }
};

exports.updateTodo = (req, res) => {
  try {
    const parsedData = todoSchema.partial().parse(req.body);
    const todoIndex = todos.findIndex((todo) => todo.id === req.params.id);
    if (todoIndex === -1)
      return res.status(404).json({ message: "Todo not found" });
    todos[todoIndex] = { ...todos[todoIndex], ...parsedData };
    res.json(todos[todoIndex]);
  } catch (err) {
    res.status(400).json({ message: err.errors || err.message });
  }
};

exports.deleteTodo = (req, res) => {
  const todoIndex = todos.findIndex((todo) => todo.id === req.params.id);
  if (todoIndex === -1)
    return res.status(404).json({ message: "Todo not found" });
  todos.splice(todoIndex, 1);
  res.json({ message: "Todo deleted successfully" });
};
