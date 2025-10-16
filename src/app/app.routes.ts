import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/public-layout/public-layout.component').then(
        (m) => m.PublicLayoutComponent
      ),
    loadChildren: () => import('./features/landing/landing.routes'),
  },
  {
    path: 'login',
    title: 'InkSync | Iniciar Sesión',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent
      ),
    loadChildren: () => import('./features/dashboard/dashboard.routes'),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
