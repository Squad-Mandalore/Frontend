import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {authGuard} from "./shared/guard/auth.guard";
import { ExerciseOverviewComponent } from './pages/exercise-overview-page/exercise-overview-page.component';
import { TrainerOverviewPageComponent } from './pages/trainer-overview-page/trainer-overview-page.component';
import { HelpPageComponent } from './pages/help-page/help-page.component';
import { athleteGuard } from './shared/guard/athlete.guard';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: "login", component: LoginPageComponent},
    {path: "athleten", component: DashboardPageComponent, canActivate: [authGuard]},
    {path: "athleten/:id", component: DashboardPageComponent, canActivate: [authGuard]},
    {path: "trainer", component: TrainerOverviewPageComponent, canActivate: [authGuard, athleteGuard]},
    {path: "trainer/:id", component: TrainerOverviewPageComponent, canActivate: [authGuard, athleteGuard]},
    {path: "exercises", component: ExerciseOverviewComponent, canActivate: [authGuard, athleteGuard]},
    {path: "help", component: HelpPageComponent, canActivate: [authGuard]},
    {path: "**", redirectTo: 'login'}
];
