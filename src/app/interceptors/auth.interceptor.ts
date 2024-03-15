import { HttpInterceptorFn } from '@angular/common/http';
import { LocalStorageService } from '../services/local-storage.service';
import { inject } from '@angular/core';
import { EMPTY, catchError, switchMap, throwError } from 'rxjs';
import { AuthService, Token } from '../shared/generated';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // First case: login request
    if (req.url.includes('auth/login')) {
        return next(req);
    }
    // Second case: refresh token request
    let localStorageService: LocalStorageService = inject(LocalStorageService);
    if (req.url.includes('auth/refresh')) {
        return next(req).pipe(
            catchError((error) => {
                if (error.status != 401) {
                    return throwError(() => error);
                }

                //TODO logout
                localStorageService.clear();
                return EMPTY;
            })
        );
    }
    // Third case: any other request
    let newreq = req;
    const accessToken = localStorageService.getItem('access_token');
    if (accessToken) {
        newreq = req.clone({ headers: req.headers.set('Authorization', `Bearer ${accessToken}`) });
    }
    let authService: AuthService = inject(AuthService);
    return next(newreq).pipe(
        // If the accessToken is invalid, we try to refresh it
        catchError((error) => {
            if (error.status != 401) {
                return throwError(() => error);
            }

            // Triggers second case and refreshes the token then retries the request
            return authService.refreshAccessTokenAuthRefreshPost(localStorageService.getItem('refresh_token')).pipe(
                switchMap((token: Token) => {
                    localStorageService.setItem('access_token', token.access_token);
                    localStorageService.setItem('refresh_token', token.refresh_token);

                    const newAccessToken = localStorageService.getItem('access_token');
                    let newnewreq = newreq.clone({ headers: newreq.headers.set('Authorization', `Bearer ${newAccessToken}`) });
                    return next(newnewreq);
                })
            );
        })
    );
};
