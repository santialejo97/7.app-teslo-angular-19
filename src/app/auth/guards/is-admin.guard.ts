import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const isAdminGuard: CanMatchFn = async (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await firstValueFrom(authService.checkStatus());
  const userRoles = authService.userRoles();
  console.log(userRoles);
  if (!userRoles) return false;

  if (!userRoles.includes('admin')) {
    router.navigateByUrl('/');
    return false;
  }
  return true;
};
