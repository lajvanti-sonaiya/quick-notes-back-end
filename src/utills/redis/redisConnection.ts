import { Redis } from "ioredis";
import { envObj } from "../../config/index.js";

const redis = new Redis({
  host: envObj.REDIS_HOST,
  port: Number(envObj.REDIS_PORT),
});

export default redis;
