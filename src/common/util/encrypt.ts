import { hash, verify } from 'argon2';

export class Encrypt {
  static async createHash(value: string): Promise<string> {
    return hash(value);
  }

  static async isSameAsHash(
    hashedToken: string,
    plainToken: string,
  ): Promise<boolean> {
    return verify(hashedToken, plainToken);
  }
}
