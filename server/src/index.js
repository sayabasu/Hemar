import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './libs/prisma.js';
import { connectMongo } from './libs/mongoose.js';
import { logger } from './libs/logger.js';
import { ensureImageStorage } from './integrations/storage/filesystem.js';

const start = async () => {
  try {
    await connectMongo();
    await prisma.$connect();
    await ensureImageStorage();
    app.listen(env.port, () => {
      logger.info({ message: `Server listening on port ${env.port}` });
    });
  } catch (error) {
    logger.error({ message: 'Failed to start server', error: error.message });
    process.exit(1);
  }
};

start();
