import { redisClient } from '../config/redis';

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    if (!redisClient.isOpen) return null;
    const data = await redisClient.get(key);
    return data ? (JSON.parse(data) as T) : null;
  } catch {
    return null;
  }
};

export const setCache = async (key: string, value: any, ttlSeconds = 300) => {
  try {
    if (!redisClient.isOpen) return;
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch {
    // silently fail
  }
};

export const deleteCache = async (pattern: string) => {
  try {
    if (!redisClient.isOpen) return;
    const keys = await redisClient.keys(pattern);
    if (keys.length) await redisClient.del(keys);
  } catch {
    // silently fail
  }
};