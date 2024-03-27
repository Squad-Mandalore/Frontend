import {Component} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertComponent} from "../../components/alert/alert.component";
import {NgClass} from "@angular/common";
import {PrimaryButtonComponent} from "../../components/buttons/primary-button/primary-button.component";
import {AuthExtentionService} from "../../shared/auth-extention.service";
import {LoggerService} from "../../shared/logger.service";
import {LocalStorageService} from "../../shared/local-storage.service";
import {AlertService} from "../../shared/alert.service";
import {HttpErrorResponse} from "@angular/common/http";
import {AthletesService, AuthService, Token} from "../../shared/generated";


@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [ReactiveFormsModule, AlertComponent, NgClass, PrimaryButtonComponent],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
    protected loginForm;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private authExtService: AuthExtentionService,
        private athleteService: AthletesService,
        private router: Router,
        private logger: LoggerService,
        private localStorageService: LocalStorageService,
        private alertService: AlertService
    ) {
        if (this.authExtService.isLoggedIn()) {
            this.router.navigate(['/athleten']);
        }
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    onSubmit() {
        this.authService.loginForAccessTokenAuthLoginPost(this.loginForm.value.username!, this.loginForm.value.password!).subscribe({
            next: (token: Token) => {
                this.localStorageService.setItem('access_token', token.access_token);
                this.localStorageService.setItem('refresh_token', token.refresh_token);
                this.router.navigate(['/athleten']);
            },
            error: (error: HttpErrorResponse) => {
                this.alertService.show('Login fehlgeschlagen', 'Benutzername oder Passwort falsch!', "error");
            }
        });
    }
}

