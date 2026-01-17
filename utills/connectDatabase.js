const mongoose = require("mongoose");
const { envObj } = require("../config");

const connectDatabase = async () => {
  try {
    const con = await mongoose.connect(envObj.DATABSE_URL);
    console.log("database connected", con.connection.host);
  } catch (error) {
    console.log("🚀 ~ connectDatabase ~ error:", error);
    throw error;
  }
};

module.exports = connectDatabase;
