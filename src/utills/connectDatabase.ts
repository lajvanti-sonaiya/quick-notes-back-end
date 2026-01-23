import mongoose from "mongoose";
import { envObj } from "../config/index.js";

const connectDatabase = async () => {
  try {
    const con = await mongoose.connect(envObj.DATABSE_URL);
    console.log("database connected", con.connection.host);
  } catch (error) {
    console.log("🚀 ~ connectDatabase ~ error:", error);
    throw error;
  }
};

 export default connectDatabase;

