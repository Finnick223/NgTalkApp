import { Routes } from '@angular/router';
import { guestGuard } from '@Guards/guest/guest.guard';
import { AuthLayoutComponent } from '@Layouts/auth-layout/auth-layout.component';
import { LoginPageComponent } from '@Pages/auth/login-page/login-page.component';
import { RegisterPageComponent } from '@Pages/auth/register-page/register-page.component';

export const auth_routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        canActivate: [guestGuard],
        component: LoginPageComponent,
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        component: RegisterPageComponent,
      },
    ],
  },
];
