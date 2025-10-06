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
  storage: {
    endpoint: process.env.MINIO_ENDPOINT,
    region: process.env.MINIO_REGION || 'us-east-1',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    bucket: process.env.MINIO_BUCKET,
    publicUrl: process.env.MINIO_PUBLIC_URL || process.env.MINIO_ENDPOINT,
    uploadUrlOverride: process.env.MINIO_UPLOAD_URL_OVERRIDE,
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

const requiredStorageValues = [
  { value: env.storage.endpoint, name: 'MINIO_ENDPOINT' },
  { value: env.storage.accessKey, name: 'MINIO_ACCESS_KEY' },
  { value: env.storage.secretKey, name: 'MINIO_SECRET_KEY' },
  { value: env.storage.bucket, name: 'MINIO_BUCKET' },
];

for (const item of requiredStorageValues) {
  if (!item.value) {
    throw new Error(`${item.name} must be defined`);
  }
}

if (!env.storage.publicUrl) {
  throw new Error('MINIO_PUBLIC_URL must be defined');
}
