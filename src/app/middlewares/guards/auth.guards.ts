import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

export const privateGuard = (): CanActivateFn => {
  const authService = inject(AuthService);
  return false;
  return () => {
    const token = authService.getToken();
    return !!token;
  };
};

export const publicGuard = (): CanActivateFn => {
  const authService = inject(AuthService);
  return () => {
    const token = authService.getToken();
    return !token;
  };
};
