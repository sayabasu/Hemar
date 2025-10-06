import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const parseOrigins = (origins) =>
  origins.split(',').map((origin) => origin.trim()).filter(Boolean);

const resolveDirectory = (value) => {
  const target = value && value.trim() ? value.trim() : path.join('..', 'images');
  return path.isAbsolute(target) ? target : path.resolve(process.cwd(), target);
};

const normalizePublicPath = (value) => {
  if (!value) {
    return '/images';
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return '/images';
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};

export const env = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  corsOrigins: process.env.CORS_ORIGINS ? parseOrigins(process.env.CORS_ORIGINS) : ['http://localhost:3000'],
  mongoUrl: process.env.MONGO_URL,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  storage: {
    imagesDir: resolveDirectory(process.env.IMAGES_DIRECTORY),
    publicPath: normalizePublicPath(process.env.IMAGES_PUBLIC_PATH),
  },
};

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL must be defined');
}

if (!env.jwtSecret) {
  throw new Error('JWT_SECRET must be defined');
}

if (!env.mongoUrl) {
  throw new Error('MONGO_URL must be defined');
}

if (!env.storage.imagesDir) {
  throw new Error('IMAGES_DIRECTORY must resolve to a valid path');
}
