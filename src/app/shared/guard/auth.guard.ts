import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthExtentionService } from '../auth-extention.service';

export const authGuard: CanActivateFn = () => {
    const authExtService = inject(AuthExtentionService);
    if (authExtService.isLoggedIn()) {
        return true;
    }
    authExtService.logout();
    return false;
};
