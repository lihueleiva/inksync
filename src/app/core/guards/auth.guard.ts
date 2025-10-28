import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

const isUserLoggedIn = (): boolean => true;

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (isUserLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
