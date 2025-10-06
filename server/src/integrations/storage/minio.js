// eslint-disable-next-line import/named
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../../config/env.js';

const normalizeKey = (key) => key.replace(/^\/+/, '');
const removeTrailingSlash = (value) => value.replace(/\/+$/, '');

const createClient = (endpoint) =>
  new S3Client({
    region: env.storage.region,
    endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: env.storage.accessKey,
      secretAccessKey: env.storage.secretKey,
    },
  });

export const minioClient = createClient(env.storage.endpoint);
const minioPublicClient = createClient(env.storage.publicUrl);

/**
 * Generates a presigned URL for uploading content to MinIO.
 * @param {{
 *   key: string;
 *   contentType: string;
 *   expiresIn?: number;
 * }} params
 */
export const createPresignedUploadUrl = async ({ key, contentType, expiresIn = 300 }) => {
  const normalizedKey = normalizeKey(key);
  const command = new PutObjectCommand({
    Bucket: env.storage.bucket,
    Key: normalizedKey,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(minioPublicClient, command, { expiresIn });
  return {
    uploadUrl,
    objectKey: normalizedKey,
    fileUrl: buildPublicUrl(normalizedKey),
    expiresIn,
  };
};

/**
 * Builds the public URL for a stored object.
 * @param {string} key
 */
export const buildPublicUrl = (key) => {
  const normalizedKey = normalizeKey(key);
  const base = removeTrailingSlash(env.storage.publicUrl);
  return `${base}/${env.storage.bucket}/${normalizedKey}`;
};
