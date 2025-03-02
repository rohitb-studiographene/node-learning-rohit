const express = require("express");
const path = require("path");
const homeRoutes = require("./routes/home");
const userRoutes = require("./routes/users");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.use("/", homeRoutes);
app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
