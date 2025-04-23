import { Injectable } from '@angular/core';
import { JwtPayload } from '@Interfaces/payloads/auth/jwt-payload.interface';
import { RoutingService } from '@Services/routing/routing.service';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenService {
  constructor(private routingService: RoutingService) {}
  private readonly tokenKey = 'auth_token';
  private tokenTimeout: any;

  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.startTokenWatcher();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private decodeTokenPayload(token: string): JwtPayload | null {
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length < 3) {
        console.warn('Invalid JWT format');
        return null;
      }
      const base64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (e) {
      console.error('Decoding jwt failed:', e);
      return null;
    }
  }

  startTokenWatcher(): void {
    if (this.tokenTimeout) {
      clearTimeout(this.tokenTimeout);
    }
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      const payload = this.decodeTokenPayload(token);
      if (payload?.exp) {
        const expirationTime = payload.exp * 1000;
        const timeout = expirationTime - Date.now();
        if (timeout <= 1000 && timeout > 0) {
          this.tokenTimeout = setTimeout(() => this.logout(), timeout);
        } else if (timeout <= 0) {
          this.logout();
        }
      }
    }
  }

  stopTokenWatcher(): void {
    if (this.tokenTimeout) {
      clearTimeout(this.tokenTimeout);
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeTokenPayload(token);
      if (payload) {
        // Consider missing exp claim as expired
        const hasExpiration = typeof payload.exp !== 'undefined';
        const expirationTime = payload.exp ? payload.exp * 1000 : 0;
        return hasExpiration ? expirationTime < Date.now() : true;
      }
      return true;
    } catch (e) {
      console.error('Error parsing token:', e);
      return true;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const isValid = !!token && !this.isTokenExpired(token);

    if (!isValid) {
      this.clearToken();
    }

    return isValid;
  }

  getUsernameFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = this.decodeTokenPayload(token);
      return payload?.['username'] || payload?.sub || null;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  logout(): void {
    this.stopTokenWatcher();
    this.clearToken();
    this.routingService.navigateToLogin();
  }
}
