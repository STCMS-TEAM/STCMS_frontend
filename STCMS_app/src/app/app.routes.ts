import { Routes } from '@angular/router';
import { Homepage } from '../app/domains/home/pages/homepage/homepage';
import { AdminDashboard } from './domains/admin/pages/admin-dashboard/admin-dashboard';
export const routes: Routes = [
  {
    path: 'home',
    component: Homepage,
  },
  {
    path: 'admin',
    component: AdminDashboard,
  },
  // {
  //   path: 'register',
  //   component: Register,
  // },
  // {
  //   path: 'login',
  //   component: Login,
  // },
];
