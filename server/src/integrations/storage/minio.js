/* eslint-disable import/named */
import {
  S3Client,
  PutObjectCommand,
  PutBucketPolicyCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
/* eslint-enable import/named */
import { env } from '../../config/env.js';
import { logger } from '../../libs/logger.js';
import { createPublicUrlBuilder } from './utils/urlUtils.js';

const normalizeKey = (key) => key.replace(/^\/+/, '');

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

const publicUrlBuilder = createPublicUrlBuilder({
  publicUrl: env.storage.publicUrl,
  bucket: env.storage.bucket,
});

const isMissingBucketError = (error) => {
  const statusCode = error?.$metadata?.httpStatusCode;
  const errorCode = error?.Code || error?.name;
  return statusCode === 404 || errorCode === 'NoSuchBucket' || errorCode === 'NotFound';
};

const ensureBucketExists = async () => {
  try {
    await minioClient.send(
      new HeadBucketCommand({
        Bucket: env.storage.bucket,
      }),
    );
  } catch (error) {
    if (!isMissingBucketError(error)) {
      throw error;
    }

    const params = { Bucket: env.storage.bucket };
    if (env.storage.region && env.storage.region !== 'us-east-1') {
      params.CreateBucketConfiguration = { LocationConstraint: env.storage.region };
    }

    await minioClient.send(new CreateBucketCommand(params));
    logger.info({ message: `Created MinIO bucket ${env.storage.bucket}` });
  }
};

/**
 * Builds the public URL for a stored object.
 * @param {string} key
 */
export const buildPublicUrl = (key) => {
  const normalizedKey = normalizeKey(key);
  return publicUrlBuilder(normalizedKey);
};

const buildPublicReadPolicy = (bucket) =>
  JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  });

/**
 * Ensures the target bucket is publicly readable so assets can be accessed from the frontend.
 */
export const ensurePublicBucketAccess = async () => {
  try {
    await ensureBucketExists();
    const policy = buildPublicReadPolicy(env.storage.bucket);
    await minioClient.send(
      new PutBucketPolicyCommand({
        Bucket: env.storage.bucket,
        Policy: policy,
      }),
    );
    logger.info({ message: 'MinIO bucket policy updated for public read access' });
  } catch (error) {
    logger.error({
      message: 'Failed to configure MinIO bucket policy',
      error: error.message,
    });
    throw error;
  }
};

/**
 * Uploads a file buffer directly to MinIO and returns its public URL.
 * @param {{
 *   key: string;
 *   body: import('stream').Readable | Buffer | Uint8Array | string;
 *   contentType: string;
 * }} params
 */
export const uploadObject = async ({ key, body, contentType }) => {
  const normalizedKey = normalizeKey(key);
  const command = new PutObjectCommand({
    Bucket: env.storage.bucket,
    Key: normalizedKey,
    Body: body,
    ContentType: contentType,
  });
  await minioClient.send(command);
  return {
    objectKey: normalizedKey,
    fileUrl: buildPublicUrl(normalizedKey),
  };
};
