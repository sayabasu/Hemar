import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from './logger.js';

export const connectMongo = async () => {
  try {
    await mongoose.connect(env.mongoUrl, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info({ message: 'MongoDB connected' });
  } catch (error) {
    logger.error({ message: 'MongoDB connection failed', error });
    throw error;
  }
};

export const disconnectMongo = () => mongoose.disconnect();
