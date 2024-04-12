import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthExtentionService } from '../auth-extention.service';
import { AuthService, UserResponseSchema } from '../generated';

export const authGuard: CanActivateFn = () => {
    const authExtService = inject(AuthExtentionService);
    const authService = inject(AuthService);
    let returnBool: true | false = false;

    if (!authExtService.isLoggedIn()){
        authExtService.logout();
        return false;
    }
    
    authService.whoAmIAuthWhoamiGet().subscribe({
        next: (user: UserResponseSchema) => {
            if(user.last_edited_at !== user.last_password_change){
                returnBool = true;
            }
        }
    });
    return returnBool;
};
