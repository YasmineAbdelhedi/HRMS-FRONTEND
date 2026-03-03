import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Adjust the path if needed
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const loggedIn = authService.isLoggedIn();
  try {
    // eslint-disable-next-line no-console
    console.debug('[authGuard] isLoggedIn:', loggedIn, 'attempting route:', state?.url);
  } catch (e) {}

  if (loggedIn) {
    return true;
  } else {
    // Return a UrlTree to redirect to login instead of performing navigation here
    return router.parseUrl('/authentication/login') as unknown as boolean | UrlTree;
  }
};
