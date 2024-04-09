import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthExtentionService {

    constructor(private localStorageService: LocalStorageService, private router: Router) { }

    logout(): void {
        this.localStorageService.clear();
        this.router.navigate(['/login']);
    }

    isLoggedIn(): boolean {
        return !!this.localStorageService.getItem('access_token');
    }
}
