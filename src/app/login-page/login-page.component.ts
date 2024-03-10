import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalStorageService } from '../services/local-storage.service';
import { AthletesService, AuthService } from '../shared/generated';

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
    loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
    });
    constructor(
        private formBuilder: FormBuilder,
        private localStorageService: LocalStorageService,
        private authService: AuthService,
        private athleteService: AthletesService,
    ) { }

    onSubmit() {
        this.authService.loginForAccessTokenAuthLoginPost(this.loginForm.value.username!, this.loginForm.value.password!).subscribe(token => {
            this.localStorageService.setItem('access_token', token.access_token);
            this.localStorageService.setItem('refresh_token', token.refresh_token);
            //TODO redirect to Dashboard
        });
    }
}
