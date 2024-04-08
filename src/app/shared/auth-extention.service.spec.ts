import { TestBed } from '@angular/core/testing';

import { AuthExtentionService } from './auth-extention.service';
import { LocalStorageService } from './local-storage.service';

describe('AuthExtentionService', () => {
    let service: AuthExtentionService;
    let localStorageService: LocalStorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AuthExtentionService);
        localStorageService = TestBed.inject(LocalStorageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should clear localStorge', () => {
        service.logout();
        expect(localStorageService.getItem('access_token')).toBeNull();
    });

    it('should be logged in', () => {
        localStorageService.setItem('access_token', 'test_token');
        expect(service.isLoggedIn()).toBeTrue();
    });

    it('should not be logged in', () => {
        service.logout();
        expect(service.isLoggedIn()).toBeFalse();
    });
});
