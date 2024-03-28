import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {authGuard} from "./shared/guard/auth.guard";

export const routes: Routes = [
    {path: "login", component: LoginPageComponent},
    {path: "athleten", component: DashboardPageComponent, canActivate: [authGuard]},
    {path: "athleten/:id", component: DashboardPageComponent},
    {path: '', redirectTo: 'athleten', pathMatch: 'full'}
];
