import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Adjust the path if needed
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = (route.data && route.data['roles']) as string[] | undefined;

  // If no roles are required for this route, allow access
  if (!requiredRoles || requiredRoles.length === 0) return true;

  // Diagnostic logging
  try {
    // eslint-disable-next-line no-console
    console.debug('[roleGuard] route:', route.routeConfig?.path, 'requiredRoles:', requiredRoles);
  } catch (e) {}

  const userRoles = authService.getUserRoles() as string[] | undefined;

  // Ensure userRoles is an array
  const rolesArr = Array.isArray(userRoles) ? userRoles : (userRoles ? [userRoles] : []);

  // Check intersection
  const allowed = requiredRoles.some((role: string) => rolesArr.includes(role));
  try {
    // eslint-disable-next-line no-console
    console.debug('[roleGuard] userRoles:', rolesArr, 'allowed:', allowed);
  } catch (e) {}

  if (allowed) return true;

  // If user is not allowed, redirect to login (or another page). Return UrlTree to avoid navigation side-effects.
  return router.parseUrl('/authentication/login') as unknown as boolean | UrlTree;
};
