import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    { path: "login", component: LoginPageComponent },
    { path: "athleten", component: DashboardPageComponent, canActivate: [authGuard] },
    { path: '', redirectTo: '/athleten', pathMatch: 'full' },
    { path: '**', redirectTo: '/athleten' },
];
