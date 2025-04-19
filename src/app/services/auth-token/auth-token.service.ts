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
        console.warn('Token does not appear to be in JWT format, skipping expiration check.');
        return null;
      }
      const base64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (e) {
      console.error('Failed to decode token payload:', e);
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
        if (timeout <= 1000) {
          this.tokenTimeout = setTimeout(() => {
            this.logout();
          }, timeout);
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
      if (!!payload) {
        const isExpired = payload.exp ? payload.exp * 1000 < Date.now() : false;
        // console.log('Exp time:', payload.exp ? new Date(payload.exp * 1000) : 'No expiration');
        // console.log('Current time:', new Date());
        return isExpired;
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

  logout(): void {
    this.stopTokenWatcher();
    this.clearToken();
    this.routingService.navigateToLogin();
  }
}
