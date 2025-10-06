import { hashPassword, validatePassword } from '../src/modules/auth/auth.crypto.js';

describe('Auth service', () => {
  it('hashes and validates password', async () => {
    const password = 'Secret123!';
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    const match = await validatePassword(password, hash);
    expect(match).toBe(true);
  });
});
