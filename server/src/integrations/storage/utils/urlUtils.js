const normalizeKey = (key = '') => String(key).replace(/^\/+/, '');
const removeTrailingSlash = (value = '') => String(value).replace(/\/+$/, '');
const ensureLeadingSlash = (value = '') => (String(value).startsWith('/') ? String(value) : `/${String(value)}`);

const ensureBucketPrefixedPath = (path, bucket) => {
  const withLeadingSlash = ensureLeadingSlash(path || '/');

  if (!bucket) {
    return withLeadingSlash;
  }

  if (withLeadingSlash === '/' || withLeadingSlash === '') {
    return `/${bucket}`;
  }

  if (withLeadingSlash === `/${bucket}` || withLeadingSlash.startsWith(`/${bucket}/`)) {
    return withLeadingSlash;
  }

  return `/${bucket}${withLeadingSlash}`;
};

const parseUrl = (value) => {
  try {
    return new URL(value);
  } catch (error) {
    return null;
  }
};

const getOrigin = (value) => {
  const parsed = parseUrl(value);
  return parsed ? parsed.origin : null;
};

const toAbsolutePath = (value) => {
  const trimmed = String(value).trim();
  if (!trimmed) {
    return '';
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  const firstSlashIndex = trimmed.indexOf('/');
  if (firstSlashIndex > -1) {
    const potentialHost = trimmed.slice(0, firstSlashIndex);
    if (potentialHost.includes(':')) {
      const path = trimmed.slice(firstSlashIndex);
      return path.startsWith('/') ? path : `/${path}`;
    }
  }

  return `/${trimmed}`;
};

export const createPublicUrlBuilder = ({ publicUrl, bucket }) => {
  const base = removeTrailingSlash(publicUrl || '');

  if (!base) {
    throw new Error('A public storage URL is required to build object URLs.');
  }

  return (key) => {
    const normalizedKey = normalizeKey(key);
    const bucketPath = ensureBucketPrefixedPath(normalizedKey ? `/${normalizedKey}` : '/', bucket);
    return `${base}${bucketPath}`;
  };
};

export const createImageUrlNormalizer = ({ publicUrl, endpoint, bucket }) => {
  const base = removeTrailingSlash(publicUrl || '');

  if (!base) {
    throw new Error('A public storage URL is required to normalize image URLs.');
  }

  const endpointOrigin = getOrigin(endpoint);

  return (value) => {
    if (!value) {
      return value;
    }

    const parsed = parseUrl(value);

    if (!parsed) {
      const absolutePath = toAbsolutePath(value);
      if (!absolutePath) {
        return base;
      }
      const bucketPath = ensureBucketPrefixedPath(absolutePath, bucket);
      return `${base}${bucketPath}`;
    }

    if (endpointOrigin && parsed.origin === endpointOrigin) {
      const bucketPath = ensureBucketPrefixedPath(parsed.pathname, bucket);
      return `${base}${bucketPath}${parsed.search}${parsed.hash}`;
    }

    return parsed.href;
  };
};

export const __private = {
  normalizeKey,
  removeTrailingSlash,
  ensureLeadingSlash,
  ensureBucketPrefixedPath,
  parseUrl,
  getOrigin,
  toAbsolutePath,
};
