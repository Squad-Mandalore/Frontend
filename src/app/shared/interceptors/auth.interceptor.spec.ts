import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';

import { authInterceptor } from './auth.interceptor';
import { of, throwError } from 'rxjs';
import { LocalStorageService } from '../local-storage.service';
import { AuthService, Token } from '../generated';

describe('authInterceptor', () => {
    const interceptor: HttpInterceptorFn = (req, next) =>
        TestBed.runInInjectionContext(() => authInterceptor(req, next));

    let localStorageService: LocalStorageService;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('AuthService', ['refreshAccessTokenAuthRefreshPost']);
        TestBed.configureTestingModule({
            providers: [LocalStorageService, HttpClient, { provide: AuthService, useValue: spy }]
        });
        localStorageService = TestBed.inject(LocalStorageService);
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });

    it('should have authorization header', (done) => {
        localStorageService.setItem('access_token', 'test_token');
        const request = new HttpRequest('GET', '/test');
        const nextFn: HttpHandlerFn = (req) => {
            expect(req.headers.has('Authorization')).toBeTrue();
            return of(new HttpResponse({ status: 200 }));
        }

        interceptor(request, nextFn).subscribe({
            complete() {
                done();
            },
        });
    });

    it('should have error with status 500', (done) => {
        const request = new HttpRequest('GET', '/test');
        const nextFn: HttpHandlerFn = (req) => {
            return throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' }));
        }

        interceptor(request, nextFn).subscribe({
            next(value) {
                console.log(value);
                fail('This should have been an error response (next)');
            },
            error(err) {
                expect(err.status).toEqual(500);
                done();
            },
            complete() {
                fail('This should have been an error response (complete)');
            },
        });
    });

    it('should have error with status 401', (done) => {
        const request = new HttpRequest('GET', '/test');
        const nextFn: HttpHandlerFn = (req) => {
            return throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }));
        }

        interceptor(request, nextFn).subscribe({
            next(value) {
                console.log(value);
                fail('This should have been an error response (next)');
            },
            error(err) {
                expect(err.status).toEqual(401);
                done();
            },
            complete() {
                fail('This should have been an error response (complete)');
            },
        });
    });
    it('should retry request', (done) => {
        authServiceSpy.refreshAccessTokenAuthRefreshPost.and.returnValue(of(new HttpResponse<Token>({ body: { access_token: 'access', refresh_token: 'refresh', token_type: 'Bearer' } })));
        localStorageService.setItem('refresh_token', 'test_token');
        const request = new HttpRequest('GET', '/test');
        const nextFn: HttpHandlerFn = (req) => {
            return throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }));
        }

        interceptor(request, nextFn).subscribe({
            next(value) {
                fail('This should have been an error response (next)');
            },
            error(err) {
                expect(err.status).toEqual(401);
                done();
            },
            complete() {
                fail('This should have been an error response (complete)');
            },
        });
    });
});
