import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { routes } from '../../app.routes';
import { firstValueFrom } from 'rxjs';

export const noAuthenticatedGuard: CanMatchFn = async (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuth = await firstValueFrom(authService.checkStatus());
  console.log(isAuth);

  if (isAuth) {
    router.navigateByUrl('/');
    return false;
  }

  return true;
};
