import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const identityGuard: CanActivateFn = (route, state) => {
  let token = localStorage.getItem('token');
  let router = inject(Router);

  if (token) {
    return true;
  }
  else {
    router.navigate(['/error']);
    return false;
  }
};
