import { createClient } from 'redis';
import { env } from './env';

export const redisClient = createClient({
  url: env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    // Sirf 1 baar try karega, phir chhod dega (infinite retry nahi)
    reconnectStrategy: (retries) => {
      if (retries > 0) {
        return new Error('Redis not available — skipping');
      }
      return 1000;
    },
  },
});

// Sirf ek baar error print karega
let redisErrorPrinted = false;
redisClient.on('error', (err) => {
  if (!redisErrorPrinted) {
    console.warn('⚠️ Redis not available — continuing without cache');
    redisErrorPrinted = true;
  }
});

redisClient.on('ready', () => {
  console.log('✅ Redis connected');
  redisErrorPrinted = false;
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
    } catch (err) {
      // Warning already upar print ho chuki hai, yahan kuch mat karo
    }
  }
};