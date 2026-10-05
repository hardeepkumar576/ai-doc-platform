import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { connectRedis } from './config/redis';

const start = async () => {
  await connectDB();

  try {
    await connectRedis();
  } catch (err) {
    console.warn('⚠️ Redis not available, continuing without cache');
  }

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  });
};

start();