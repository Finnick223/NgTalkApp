import { Routes } from '@angular/router';
import { auth_routes } from './auth.routes';
import { app_routes } from './app.routes';

export const routes: Routes = [
  ...auth_routes,
  ...app_routes,
  { path: '**', redirectTo: '/' },
];
