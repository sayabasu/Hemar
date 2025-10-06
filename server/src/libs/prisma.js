import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';

export const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' },
    { emit: 'event', level: 'info' },
  ],
});

prisma.$on('error', (event) => {
  logger.error({ message: 'Prisma error', event });
});

prisma.$on('warn', (event) => {
  logger.warn({ message: 'Prisma warning', event });
});

prisma.$on('info', (event) => {
  logger.info({ message: 'Prisma info', event });
});

prisma.$on('query', (event) => {
  logger.debug({ message: 'Prisma query', event });
});
