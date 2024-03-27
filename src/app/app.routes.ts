import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {authGuard} from "./shared/guard/auth.guard";
import {DisciplineMenuComponent} from "./discipline-menu/discipline-menu.component";

export const routes: Routes = [
    {path: "login", component: LoginPageComponent},
    {path: "athleten", component: DashboardPageComponent, canActivate: [authGuard]},
    {path: "athleten/:id", component: DashboardPageComponent},
  {path: "testo", component: DisciplineMenuComponent}
];
