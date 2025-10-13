import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

const landingRoutes: Routes = [
  {
    path: '',
    title: 'InkSync | Inicio',
    component: HomeComponent,
  },
];

export default landingRoutes;
