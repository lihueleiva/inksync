import { Routes } from '@angular/router';

const dashboardRoutes: Routes = [
  {
    path: 'consultations',
    title: 'InkSync | Consultas',
    loadComponent: () =>
      import('./pages/consultations/consultations.component').then(m => m.ConsultationsComponent),
  },
  {
    path: 'calendar',
    title: 'InkSync | Agenda',
    loadComponent: () =>
      import('./pages/calendar/calendar.component').then(m => m.CalendarComponent),
  },
  {
    path: 'clients',
    title: 'InkSync | Clientes',
    loadComponent: () =>
      import('./pages/clients/clients.component').then(m => m.ClientsComponent),
  },
  {
    path: 'portfolio',
    title: 'InkSync | Gestionar Portafolio',
    loadComponent: () =>
      import('./pages/portfolio-manager/portfolio-manager.component').then(m => m.PortfolioManagerComponent),
  },
  {
    path: '',
    redirectTo: 'consultations',
    pathMatch: 'full',
  }
];

export default dashboardRoutes;
