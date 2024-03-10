import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { LocalStorageService } from '../services/local-storage.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService, Token } from '../shared/generated';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.includes('auth/login')) {
        return next(req);
    }
    let localStorageService = inject(LocalStorageService);
    if (req.url.includes('auth/refresh')) {
        console.log('refresh')
        return next(req).pipe(
            catchError((error) => {
                if (error.status === 401) {
                    //TODO logout
                    localStorageService.clear();
                }
                return throwError(() => error);
            })
        );
    }
    let newreq = req;
    const accessToken = localStorageService.getItem('access_token');
    if (accessToken) {
        newreq = req.clone({ headers: req.headers.set('Authorization', `Bearer ${accessToken}`) });
    }
    let authService = inject(AuthService);
    return next(newreq).pipe(
        catchError((error) => {
            if (error.status === 401) {
                return authService.refreshAccessTokenAuthRefreshPost(localStorageService.getItem('refresh_token')).pipe(
                    switchMap((token) => {
                        localStorageService.setItem('access_token', token.access_token);
                        localStorageService.setItem('refresh_token', token.refresh_token);

                        const newAccessToken = localStorageService.getItem('access_token');
                        let newnewreq = newreq.clone({ headers: newreq.headers.set('Authorization', `Bearer ${newAccessToken}`) });
                        return next(newnewreq);
                    })
                );
            }
            return throwError(() => error);
        })
    );
};
