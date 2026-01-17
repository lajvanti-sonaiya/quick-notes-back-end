const dotenv = require("dotenv");
dotenv.config();

const required = (key) => {
    console.log("process.env")
  const value = process.env[key];
  if (!value) {
    throw new Error(` Missing environment variable: ${key}`);
  }
  return value;
};
 const envObj = {
  PORT: required("PORT"),
  DATABSE_URL: required("DATABSE_URL"),
};

module.exports={envObj}
