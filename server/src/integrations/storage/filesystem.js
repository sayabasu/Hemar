import { promises as fs } from 'node:fs';
import path from 'node:path';
import { env } from '../../config/env.js';
import { logger } from '../../libs/logger.js';

const sanitizeKey = (key = '') => {
  const normalized = path.posix.normalize(String(key).replace(/\\+/g, '/'));
  const segments = normalized.split('/').filter((segment) => segment && segment !== '.');
  const safeSegments = [];

  for (const segment of segments) {
    if (segment === '..') {
      safeSegments.pop();
    } else {
      safeSegments.push(segment);
    }
  }

  return safeSegments.join('/');
};

const ensureParentDirectory = async (filePath) => {
  const directory = path.dirname(filePath);
  await fs.mkdir(directory, { recursive: true });
};

const getStoragePath = (key) => {
  const safeKey = sanitizeKey(key);
  return path.join(env.storage.imagesDir, safeKey);
};

const removeTrailingSlash = (value = '') => String(value).replace(/\/+$/, '');
const ensureLeadingSlash = (value = '') => (String(value).startsWith('/') ? String(value) : `/${String(value)}`);

const getPublicBasePath = () => {
  const basePath = removeTrailingSlash(env.storage.publicPath || '/images');
  const normalizedBase = basePath || '/images';
  return ensureLeadingSlash(normalizedBase);
};

export const buildPublicUrl = (key) => {
  const safeKey = sanitizeKey(key);
  const basePath = getPublicBasePath();
  return `${basePath}/${safeKey}`.replace(/\/+/g, '/');
};

export const normalizeImageUrl = (value) => {
  if (!value) {
    return value;
  }

  if (/^https?:\/\//i.test(value) || value.startsWith('data:')) {
    return value;
  }

  const basePath = getPublicBasePath();

  if (value.startsWith(basePath)) {
    return value;
  }

  const safeValue = sanitizeKey(value);
  return `${basePath}/${safeValue}`.replace(/\/+/g, '/');
};

export const ensureImageStorage = async () => {
  try {
    await fs.mkdir(env.storage.imagesDir, { recursive: true });
    logger.info({ message: `Image storage ready at ${env.storage.imagesDir}` });
  } catch (error) {
    logger.error({
      message: 'Failed to initialize image storage directory',
      error: error.message,
    });
    throw error;
  }
};

/**
 * Persists an image buffer on disk and returns its public URL.
 * @param {{ key: string; body: Buffer; contentType: string }} params
 */
export const saveObject = async ({ key, body }) => {
  if (!Buffer.isBuffer(body)) {
    throw new Error('A Buffer payload is required to save an image object.');
  }

  const safeKey = sanitizeKey(key);
  const targetPath = getStoragePath(safeKey);
  await ensureParentDirectory(targetPath);
  await fs.writeFile(targetPath, body);

  return {
    objectKey: safeKey,
    fileUrl: buildPublicUrl(safeKey),
  };
};

export const __private = {
  sanitizeKey,
  getStoragePath,
};
