import mongoose from "mongoose";
import env from "./env.js";

const mongo = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      dbName: env.MONGO_DB,
    });
    mongoose.set("debug", true);
    console.log("Connected to the database");
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

export default mongo;
