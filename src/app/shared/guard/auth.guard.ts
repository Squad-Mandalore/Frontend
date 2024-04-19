import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthExtentionService } from '../auth-extention.service';
import { AuthService, UserResponseSchema } from '../generated';

export const authGuard: CanActivateFn = async () => {
    const authExtService = inject(AuthExtentionService);
    const authService = inject(AuthService);
    const user = await authService.whoAmIAuthWhoamiGet().toPromise();
    const hasInitialPassword = user && user.created_at === user.last_password_change ? true : false;
    if (!authExtService.isLoggedIn() || hasInitialPassword){
        authExtService.logout();
        return false;
    }
    return true;
};
