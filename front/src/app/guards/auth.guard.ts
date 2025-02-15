import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = JSON.parse(localStorage.getItem("token") || 'null');
  const router = inject(Router);

  if (token) {
        return true; // Permite el acceso si hay un token
  }

  router.navigate(['/login']); // Redirige al login si no hay token
  return false; // Bloquea el acceso
};
