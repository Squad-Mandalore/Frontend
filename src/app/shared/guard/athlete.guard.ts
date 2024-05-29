import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../generated';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const athleteGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const user = await firstValueFrom(authService.whoAmIAuthWhoamiGet());
  if (user?.type === 'athlete') {
    router.navigate(['/athlete']);
    return false;
  }
  return true;
};
