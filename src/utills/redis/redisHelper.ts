import redis from "./redisConnection";

export const clearNotesCache = async () => {
  const keys = await redis.keys("notes:*");
  if (keys.length) {
    await redis.del(keys);
  }
};
