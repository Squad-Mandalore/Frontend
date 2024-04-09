import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {authGuard} from "./shared/guard/auth.guard";
import { ExerciseOverviewComponent } from './pages/exercise-overview-page/exercise-overview-page.component';
import { TrainerOverviewPageComponent } from './pages/trainer-overview-page/trainer-overview-page.component';

export const routes: Routes = [
    {path: '', redirectTo: 'athleten', pathMatch: 'full'},
    {path: "login", component: LoginPageComponent},
    {path: "athleten", component: DashboardPageComponent, canActivate: [authGuard]},
    {path: "athleten/:id", component: DashboardPageComponent},
    {path: "trainer", component: TrainerOverviewPageComponent},
    {path: "trainer/:id", component: TrainerOverviewPageComponent},
    {path: "exercises", component: ExerciseOverviewComponent},
    {path: "**", redirectTo: 'athleten'}
];
