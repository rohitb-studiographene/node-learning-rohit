import express from "express";
import cors from "cors";
import env from "./config/env.js";
import routes from "./src/routes.js";
import {validateSchema} from "./middlewares/validateSchema.js";
import {registerSchema} from "./src/controllers.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = env.PORT;

app.use("/api", validateSchema(registerSchema), routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
