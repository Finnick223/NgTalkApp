import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { Router } from '@angular/router';

export const conversationGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): boolean => {
  const router = inject(Router);
  const conversationId = route.queryParams['conversationId'];

  if (!conversationId) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
