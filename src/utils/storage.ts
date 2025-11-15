export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export class StorageUtils {
  private static isClient = typeof window !== 'undefined';

  static setItem(key: string, value: string): void {
    if (this.isClient) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Error storing item:', error);
      }
    }
  }

  static getItem(key: string): string | null {
    if (this.isClient) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Error retrieving item:', error);
        return null;
      }
    }
    return null;
  }

  static removeItem(key: string): void {
    if (this.isClient) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing item:', error);
      }
    }
  }

  static setAuthTokens(tokens: AuthTokens): void {
    this.setItem('auth_tokens', JSON.stringify(tokens));
  }

  static getAuthTokens(): AuthTokens | null {
    const tokens = this.getItem('auth_tokens');
    if (tokens) {
      try {
        return JSON.parse(tokens);
      } catch {
        return null;
      }
    }
    return null;
  }

  static clearAuthTokens(): void {
    this.removeItem('auth_tokens');
  }

  static isTokenExpired(): boolean {
    const tokens = this.getAuthTokens();
    if (!tokens) return true;
    
    return Date.now() >= tokens.expiresAt;
  }
}