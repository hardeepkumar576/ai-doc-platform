import dns from 'node:dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);

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
console.log('🔑 Key check:', process.env.OPENAI_API_KEY?.slice(0, 25));
console.log('🔑 Env check:', env.OPENAI_API_KEY?.slice(0, 25));
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  });
};

start();