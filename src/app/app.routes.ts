import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { PasswordBoxComponent } from './password-box/password-box.component';

export const routes: Routes = [
    {path: "login", component: LoginPageComponent},
    {path: "register", component: PasswordBoxComponent}
];
