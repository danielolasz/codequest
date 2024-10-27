import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

export const routes: Routes = [
    { path: 'welcome', component: WelcomeComponent },
    { path: 'auth', component: AuthComponent },
    { path: 'tickets', component: TicketsComponent }, // TODO: AuthGuard
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
];
