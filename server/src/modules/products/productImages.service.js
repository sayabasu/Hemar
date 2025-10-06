import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { createPresignedUploadUrl } from '../../integrations/storage/minio.js';

const ALLOWED_CONTENT_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const CONTENT_TYPE_EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
};

const sanitizeExtension = (fileName) => {
  const extension = extname(fileName || '').toLowerCase();
  if (extension && /^[.a-z0-9]+$/.test(extension)) {
    return extension;
  }
  return '';
};

/**
 * Generates a presigned upload URL for product images.
 * @param {{ fileName: string; contentType: string; }} params
 */
export const createProductImageUpload = async ({ fileName, contentType }) => {
  if (!fileName) {
    const error = new Error('A file name is required');
    error.status = 400;
    throw error;
  }

  if (!contentType || !ALLOWED_CONTENT_TYPES.has(contentType)) {
    const error = new Error('Invalid content type. Only image uploads are supported.');
    error.status = 400;
    throw error;
  }

  const extensionFromName = sanitizeExtension(fileName);
  const extension = extensionFromName || CONTENT_TYPE_EXTENSIONS[contentType] || '';
  const key = `products/${randomUUID()}${extension}`;

  return createPresignedUploadUrl({ key, contentType, expiresIn: 300 });
};
