import { createHmac, randomBytes } from 'crypto';

export class HashService {
  static generatePassword(password: string, key: string = 'key') {
    const hmac = createHmac('sha256', key);
    hmac.update(password);
    return hmac.digest('hex');
  }

  static generateRandomHash(length: number = 32) {
    return randomBytes(length).toString('hex').slice(0, length);
  }
}
