import {Component} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertComponent} from "../../components/alert/alert.component";
import {NgClass, NgIf} from "@angular/common";
import {PrimaryButtonComponent} from "../../components/buttons/primary-button/primary-button.component";
import {AuthExtentionService} from "../../shared/auth-extention.service";
import {LoggerService} from "../../shared/logger.service";
import {LocalStorageService} from "../../shared/local-storage.service";
import {AlertService} from "../../shared/alert.service";
import {HttpErrorResponse} from "@angular/common/http";
import {AthletesService, AuthService, Token, UserResponseSchema} from "../../shared/generated";
import { InitialPasswordChangeModalComponent } from '../../components/initial-password-change-modal/initial-password-change-modal.component';
import { enterLeaveAnimation } from '../../shared/animation';


@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [ReactiveFormsModule, AlertComponent, NgClass, NgIf, PrimaryButtonComponent, InitialPasswordChangeModalComponent],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.scss',
    animations: [
        enterLeaveAnimation
    ]

})
export class LoginPageComponent {
    protected loginForm;
    user?: UserResponseSchema;
    oldPassword?: string;
    modals = {
        changePasswordModal: {
            isActive: false,
        }
    }

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
            this.authService.whoAmIAuthWhoamiGet().subscribe({
                next: (user: UserResponseSchema) => {
                    this.router.navigate(['/athleten']);
                },
                error: () => {
                    this.alertService.show("Abfragen des Benutzers fehlgeschlagen", "Bitte probiere es später erneut.", "error");
                }
            });
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
                this.authService.whoAmIAuthWhoamiGet().subscribe({
                    next: (user: UserResponseSchema) => {
                        if(user.type === "athlete"){
                            this.alertService.show("Login deaktiviert", "Der Login für Athleten wurde leider deaktiviert.", "error");
                            return;
                        }

                        if(user.created_at !== user.last_password_change){
                            this.router.navigate(['/athleten']);
                            return;
                        }
                        this.user = user;
                        this.oldPassword = this.loginForm.value.password!;
                        this.modals.changePasswordModal.isActive = true;
                    },
                    error: () => {
                        this.authExtService.logout();
                        this.alertService.show("Abfragen des Benutzers fehlgeschlagen", "Bitte probiere es später erneut.", "error");
                    }
                });
            },
            error: (error: HttpErrorResponse) => {
                this.alertService.show('Login fehlgeschlagen', 'Benutzername oder Passwort falsch!', "error");
            }
        });
    }
}

