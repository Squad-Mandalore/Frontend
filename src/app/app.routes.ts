import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    {path: "login", component: LoginComponent},
    {path: "athleten", component: DashboardComponent},
    {path: "athleten/:id", component: DashboardComponent}
];
