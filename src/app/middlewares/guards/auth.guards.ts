import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  console.log('Token:', token);

  if (!token) {
    router.navigate(['/login']).then(success => {
      if (success) {
        console.log('Redirección exitosa');
      } else {
        console.log('Error en la redirección');
      }
    });
    return false;
  }
  return true;
};
