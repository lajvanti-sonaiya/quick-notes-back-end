import dotenv from "dotenv";
dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(` Missing environment variable: ${key}`);
  }
  return value;
};
export const envObj = {
  PORT: required("PORT"),
  DATABSE_URL: required("DATABSE_URL"),
  REDIS_HOST: required("REDIS_HOST"),
  REDIS_PORT: required("REDIS_PORT"),
  REDIS_USERNAME:required("REDIS_USERNAME"),
  REDIS_PASSWORD:required("REDIS_PASSWORD")
};
