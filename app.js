const app = require("express");

app.use("/", (req, res) => {
  res.send("This is home page");
});

app.use("/users", (req, res) => {
  res.send("This is users page");
});

// Start server
app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
