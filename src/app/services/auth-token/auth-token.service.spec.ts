import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthTokenService } from './auth-token.service';
import { RoutingService } from '@Services/routing/routing.service';

describe('AuthTokenService', () => {
  let service: AuthTokenService;
  let mockRoutingService: jasmine.SpyObj<RoutingService>;
  let localStorageSpy: jasmine.Spy;
  const validToken =
    'header.eyJleHAiOjI1MjQ2MDgwMDAsInVzZXJuYW1lIjoiVGVzdFVzZXIiLCJzdWIiOiIxMjM0In0=.signature';

  beforeEach(() => {
    mockRoutingService = jasmine.createSpyObj('RoutingService', [
      'navigateToLogin',
    ]);

    TestBed.configureTestingModule({
      providers: [
        AuthTokenService,
        { provide: RoutingService, useValue: mockRoutingService },
      ],
    });

    service = TestBed.inject(AuthTokenService);
    localStorageSpy = spyOn(localStorage, 'getItem').and.callThrough();
    spyOn(localStorage, 'setItem').and.callThrough();
    spyOn(localStorage, 'removeItem').and.callThrough();

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Token Storage', () => {
    it('should store valid token and start watcher', () => {
      service.storeToken(validToken);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'auth_token',
        validToken,
      );
    });

    it('should handle empty token storage', () => {
      service.storeToken('');
      expect(localStorage.getItem('auth_token')).toBe('');
    });
  });

  describe('Token Decoding', () => {
    it('should handle malformed JWT (missing parts)', () => {
      const consoleWarnSpy = spyOn(console, 'warn');
      const result = service['decodeTokenPayload']('invalid.token');
      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should handle invalid JSON in token payload', () => {
      const invalidJson = 'invalid-json';
      const encodedPayload = btoa(invalidJson)
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
      const invalidJsonToken = `header.${encodedPayload}.signature`;
      const consoleErrorSpy = spyOn(console, 'error');

      service.storeToken(invalidJsonToken);
      const result = service.isAuthenticated();

      expect(result).toBeFalse();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('Token Expiration', () => {
    it('should consider token without exp claim as expired', () => {
      const tokenWithoutExp =
        'header.eyJ1c2VybmFtZSI6IlRlc3RVc2VyIn0=.signature';
      expect(service.isTokenExpired(tokenWithoutExp)).toBeTrue();
    });

    it('should handle token with expiration in the past', () => {
      const pastExp = Math.floor((Date.now() - 10000) / 1000);
      const token = `header.eyJleHAiOj${pastExp}fQ==.signature`;
      expect(service.isTokenExpired(token)).toBeTrue();
    });

    it('should handle token with expiration in the future', () => {
      const futureExp = Math.floor((Date.now() + 10000) / 1000);
      const payload = { exp: futureExp };
      const encodedPayload = btoa(JSON.stringify(payload))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
      const token = `header.${encodedPayload}.signature`;

      expect(service.isTokenExpired(token)).toBeFalse();
    });
  });

  describe('Authentication Status', () => {
    it('should clear invalid token automatically', () => {
      localStorage.setItem('auth_token', 'invalid.token');
      service.isAuthenticated();
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    });

    it('should return false for empty token', () => {
      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should return true for valid token', () => {
      service.storeToken(validToken);
      expect(service.isAuthenticated()).toBeTrue();
    });
  });

  describe('Token Watcher', () => {
    it('should schedule logout when expiration is imminent', fakeAsync(() => {
      const expirationTime = Date.now() + 500;
      const payload = { exp: Math.ceil(expirationTime / 1000) };
      const encodedPayload = btoa(JSON.stringify(payload))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      const token = `header.${encodedPayload}.signature`;

      service.storeToken(token);
      // tick(1000); //doesnt work that fast
      tick(4000);

      expect(mockRoutingService.navigateToLogin).toHaveBeenCalled();
    }));

    it('should not schedule logout for long-lived tokens', () => {
      const futureExp = Math.floor((Date.now() + 100000) / 1000);
      const token = `header.eyJleHAiOj${futureExp}fQ==.signature`;

      service.storeToken(token);
      service['startTokenWatcher']();

      expect(service['tokenTimeout']).toBeUndefined();
    });
  });

  describe('Username Extraction', () => {
    it('should return username when present', () => {
      service.storeToken(validToken);
      expect(service.getUsernameFromToken()).toBe('TestUser');
    });

    it('should return sub when username missing', () => {
      const token = 'header.eyJzdWIiOiIxMjM0In0=.signature';
      service.storeToken(token);
      expect(service.getUsernameFromToken()).toBe('1234');
    });

    it('should return null for missing username/sub', () => {
      const token = 'header.eyJub25hbWUiOiJOb25lIn0=.signature';
      service.storeToken(token);
      expect(service.getUsernameFromToken()).toBeNull();
    });
  });

  describe('Logout', () => {
    it('should clear token and navigation', () => {
      service.storeToken(validToken);
      service.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(mockRoutingService.navigateToLogin).toHaveBeenCalled();
      expect(service['tokenTimeout']).toBeUndefined();
    });

    it('should handle multiple logout calls', () => {
      service.logout();
      service.logout();
      expect(mockRoutingService.navigateToLogin).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle concurrent token updates', fakeAsync(() => {
      jasmine.clock().install();
      service.storeToken(validToken);
      const newToken =
        'header.eyJleHAiOjI1MjQ2MDgwMDAsInVzZXJuYW1lIjoiTmV3VXNlciJ9.signature';

      service.storeToken(newToken);
      jasmine.clock().tick(1000);

      expect(service.getUsernameFromToken()).toBe('NewUser');
      jasmine.clock().uninstall();
    }));
  });
});
