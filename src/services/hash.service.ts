import { createHmac } from 'crypto';

export class HashService {
  static generatePassword(password: string, key: string = 'key') {
    const hmac = createHmac('sha256', key);
    hmac.update(password);
    return hmac.digest('hex');
  }
}
