import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { uploadObject } from '../../integrations/storage/minio.js';

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
 * Uploads a product image directly to MinIO and returns its public URL.
 * @param {{ fileName: string; contentType: string; buffer: Buffer; }} params
 */
export const uploadProductImage = async ({ fileName, contentType, buffer }) => {
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

  if (!buffer?.length) {
    const error = new Error('An image file buffer is required for upload.');
    error.status = 400;
    throw error;
  }

  const extensionFromName = sanitizeExtension(fileName);
  const extension = extensionFromName || CONTENT_TYPE_EXTENSIONS[contentType] || '';
  const key = `products/${randomUUID()}${extension}`;

  const { fileUrl } = await uploadObject({ key, body: buffer, contentType });
  return { fileUrl };
};
