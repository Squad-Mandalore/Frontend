import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthExtentionService } from '../auth-extention.service';
import { AuthService, UserResponseSchema } from '../generated';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (req) => {
    const authExtService = inject(AuthExtentionService);
    const authService = inject(AuthService);
    const user = await firstValueFrom(authService.whoAmIAuthWhoamiGet());
    const hasInitialPassword = user && user.created_at === user.last_password_change ? true : false;
    if (!authExtService.isLoggedIn() || hasInitialPassword){
        authExtService.logout();
        return false;
    }

    console.log(req)
    if(user.type === "athlete" && req.url[0] && req.url[0].path.includes("trainer")){
        return false;
    }

    return true;
};
