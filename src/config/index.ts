import dotenv from "dotenv"
dotenv.config();

const required = (key: string): string => {
  console.log("process.env");
  const value = process.env[key];
  if (!value) {
    throw new Error(` Missing environment variable: ${key}`);
  }
  return value;
};
export const envObj = {
  PORT: required("PORT"),
  DATABSE_URL: required("DATABSE_URL"),
};
