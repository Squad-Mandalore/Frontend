import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AthletesService, AuthService } from '../shared/generated';
import { Router } from '@angular/router';
import { AlertComponent } from '../alert/alert.component';
import { LoggerService } from '../shared/logger.service';
import { LocalStorageService } from '../shared/local-storage.service';
import { AuthExtentionService } from '../shared/auth-extention.service';
import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { PrimaryButtonComponent } from '../components/buttons/primary-button/primary-button.component';

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [ReactiveFormsModule, AlertComponent, NgIf, PrimaryButtonComponent],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
    loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
    });
    alertTitle?: string;
    alertDescription?: string;
    isError: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private authExtService: AuthExtentionService,
        private athleteService: AthletesService,
        private router: Router,
        private logger: LoggerService,
        private localStorageService: LocalStorageService,
    ) {
        if (this.authExtService.isLoggedIn()) {
            this.router.navigate(['/athleten']);
        }
    }

    onSubmit() {
        this.authService.loginForAccessTokenAuthLoginPost(this.loginForm.value.username!, this.loginForm.value.password!).subscribe({
            next: (token) => {
                this.localStorageService.setItem('access_token', token.access_token);
                this.localStorageService.setItem('refresh_token', token.refresh_token);
                this.router.navigate(['/athleten']);
            },
            error: (error: HttpErrorResponse) => {
                this.alertTitle = 'Login fehlgeschlagen';
                this.alertDescription = 'Benutzername oder Passwort falsch!';
                this.isError = true;
            }
        });
    }

    alertClosed() {
        this.isError = false;
    }
}
