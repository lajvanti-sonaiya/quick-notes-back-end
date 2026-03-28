import redis from "../redis/redisConnection.js";

export const clearNotesCache = async () => {
  const keys = await redis.keys("notes:*");
  if (keys.length) {
    await redis.del(keys);
  }
};
