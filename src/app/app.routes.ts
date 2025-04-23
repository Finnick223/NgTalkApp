import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { guestGuard } from '@Guards/guest/guest.guard';
import { authGuard } from '@Guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: MainLayoutComponent,
    children: [{ path: '', component: LandingPageComponent }],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [{ path: 'login', canActivate: [guestGuard], component: LoginPageComponent }],
  },
];
