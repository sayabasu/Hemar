import dotenv from 'dotenv';

dotenv.config();

const parseOrigins = (origins) =>
  origins.split(',').map((origin) => origin.trim()).filter(Boolean);

export const env = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  corsOrigins: process.env.CORS_ORIGINS ? parseOrigins(process.env.CORS_ORIGINS) : ['http://localhost:3000'],
  mongoUrl: process.env.MONGO_URL,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
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
