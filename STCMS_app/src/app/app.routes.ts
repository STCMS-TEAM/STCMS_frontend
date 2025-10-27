import { Routes } from '@angular/router';
import { Homepage } from '../app/domains/home/pages/homepage/homepage';
import { AdminDashboard } from './domains/admin/pages/admin-dashboard/admin-dashboard';
import { Signup } from './domains/auth/signup/signup';
import { Login } from './domains/auth/login/login';
export const routes: Routes = [
  {
    path: 'home',
    component: Homepage,
  },
  {
    path: 'admin',
    component: AdminDashboard,
  },

  {
    path: 'register',
    component: Signup,
  },
  {
    path: 'login',
    component: Login,
  },
];
