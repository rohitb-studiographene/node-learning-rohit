import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const env = z
  .object({
    PORT: z.coerce.number().default(3000),
    MONGO_URI: z.string(),
    MONGO_DB: z.string(),
    JWT_SECRET: z.string(),
  })
  .parse(process.env);

export default env;
