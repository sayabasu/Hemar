import path from 'node:path';
import { env } from '../../config/env.js';
import { buildPublicUrl, normalizeImageUrl, __private } from './filesystem.js';

describe('filesystem storage integration', () => {
  it('builds a public URL using the configured base path', () => {
    const originalPublicPath = env.storage.publicPath;
    env.storage.publicPath = '/images';

    expect(buildPublicUrl('products/phone.jpg')).toBe('/images/products/phone.jpg');
    expect(buildPublicUrl('/products/phone.jpg')).toBe('/images/products/phone.jpg');

    env.storage.publicPath = originalPublicPath;
  });

  it('normalizes existing relative image paths', () => {
    const originalPublicPath = env.storage.publicPath;
    env.storage.publicPath = '/assets';

    expect(normalizeImageUrl('products/a.png')).toBe('/assets/products/a.png');
    expect(normalizeImageUrl('/assets/products/a.png')).toBe('/assets/products/a.png');
    expect(normalizeImageUrl('http://example.com/image.png')).toBe('http://example.com/image.png');

    env.storage.publicPath = originalPublicPath;
  });

  it('prevents directory traversal in storage paths', () => {
    const sanitized = __private.sanitizeKey('../secret/../../products/../image.png');
    expect(sanitized).toBe('image.png');

    const targetPath = __private.getStoragePath('../outside.png');
    expect(targetPath.startsWith(env.storage.imagesDir)).toBe(true);
    expect(targetPath).toBe(path.join(env.storage.imagesDir, 'outside.png'));
  });
});
