import mongoose from "mongoose";
import config from "./config";

const connectDB = async () => {
  try {
    const DB_URL = config.DB_URL;
    if (!DB_URL) {
      throw new Error("DB URL required");
    }
    await mongoose.connect(DB_URL);
    console.log("captain service Database connected successfully .....");
  } catch (error) {
    console.log("error", error);
  }
};

export default connectDB;
