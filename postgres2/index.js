import express from "express";
import cors from "cors";
import env from "../config/env.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
