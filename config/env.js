import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const env = z
  .object({
    PORT: z.coerce.number().default(5000),
    JWT_SECRET: z.string().default('rohit'),
  })
  .parse(process.env);

export default env;
