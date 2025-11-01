import { Routes } from '@angular/router';
import { Homepage } from '../app/domains/home/pages/homepage/homepage';
import { AdminDashboard } from './domains/admin/pages/admin-dashboard/admin-dashboard';
import { Signup } from './domains/auth/signup/signup';
import { Login } from './domains/auth/login/login';
import { Result } from './domains/results/pages/result/result';
import { CreateTournament } from './domains/results/pages/create-tournament/create-tournament';
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
  {
    path: 'result',
    component: Result,
  },
  {
    path: 'create-tournament',
    component: CreateTournament,
  },
];
