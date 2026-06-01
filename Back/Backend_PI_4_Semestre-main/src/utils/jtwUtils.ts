import jwt from 'jsonwebtoken';
import 'dotenv/config';

export class Security {
  private static readonly SECRET = process.env.JWT_SECRET || 'secret_fatec_2026';
  private static readonly EXPIRES_IN = '1h';

  public static generateToken(payload: object): string {
    return jwt.sign(payload, this.SECRET, {
      expiresIn: this.EXPIRES_IN,
      algorithm: 'HS256'
    });
  }

  public static verifyToken<T>(token: string): T | null {
    try {
      return jwt.verify(token, this.SECRET) as T;
    } catch {
      return null;
    }
  }
}