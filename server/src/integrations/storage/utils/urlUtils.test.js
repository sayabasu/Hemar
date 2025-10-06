import { createImageUrlNormalizer, createPublicUrlBuilder } from './urlUtils.js';

const config = {
  publicUrl: 'http://localhost:9000/',
  endpoint: 'http://minio:9000',
  bucket: 'hemar-assets',
};

describe('storage url utils', () => {
  describe('createPublicUrlBuilder', () => {
    it('builds a public URL with the bucket prefix for object keys', () => {
      const buildPublicUrl = createPublicUrlBuilder(config);
      expect(buildPublicUrl('products/phone.jpg')).toBe('http://localhost:9000/hemar-assets/products/phone.jpg');
    });

    it('handles keys with leading slashes without duplicating them', () => {
      const buildPublicUrl = createPublicUrlBuilder(config);
      expect(buildPublicUrl('/products/phone.jpg')).toBe('http://localhost:9000/hemar-assets/products/phone.jpg');
    });

    it('falls back to the bucket root when key is missing', () => {
      const buildPublicUrl = createPublicUrlBuilder(config);
      expect(buildPublicUrl('')).toBe('http://localhost:9000/hemar-assets');
    });
  });

  describe('createImageUrlNormalizer', () => {
    const normalize = createImageUrlNormalizer(config);

    it('passes through already public URLs', () => {
      const url = 'https://cdn.example.com/assets/products/phone.jpg';
      expect(normalize(url)).toBe(url);
    });

    it('rewrites internal endpoint URLs to the public base', () => {
      const url = 'http://minio:9000/hemar-assets/products/phone.jpg';
      expect(normalize(url)).toBe('http://localhost:9000/hemar-assets/products/phone.jpg');
    });

    it('normalizes relative paths by adding the bucket prefix', () => {
      expect(normalize('products/phone.jpg')).toBe('http://localhost:9000/hemar-assets/products/phone.jpg');
    });

    it('keeps relative paths that already include the bucket prefix intact', () => {
      expect(normalize('/hemar-assets/products/phone.jpg')).toBe(
        'http://localhost:9000/hemar-assets/products/phone.jpg',
      );
    });

    it('returns the public base when value is falsy', () => {
      expect(normalize('')).toBe('');
      expect(normalize(null)).toBe(null);
    });
  });
});
