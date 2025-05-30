import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthTokenService } from '@Services/auth-token/auth-token.service';
import { RoutingService } from '@Services/routing/routing.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthTokenService);
  const routingService = inject(RoutingService);

  if (authService.isAuthenticated()) {
    return true;
  }
  routingService.navigateToLogin();
  return false;
};
