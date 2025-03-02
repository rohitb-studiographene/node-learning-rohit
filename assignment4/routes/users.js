const express = require("express");
const path = require("path");
const router = express.Router();

const users = [];

// GET /add-user
router.get("/add-user", (req, res) =>
  res.sendFile(path.join(__dirname, "../views/add-user.html"))
);

// POST /add-user
router.post("/add-user", (req, res) => {
  const { username } = req.body;
  users.push({ username });
  // redirect to /users and show list of all users
  res.redirect("/users");
});

// GET /users-list
router.get("/users-list", (req, res) => {
  console.log(users);
  res.status(200);
  res.json(users);
});

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/users.html"));
});

module.exports = router;
