import { Routes } from '@angular/router';
import { Homepage } from '../app/domains/home/pages/homepage/homepage';
import { Tutorial } from './domains/home/pages/tutorial/tutorial';
import { AdminDashboard } from './domains/admin/pages/admin-dashboard/admin-dashboard';
import { Signup } from './domains/auth/signup/signup';
import { Login } from './domains/auth/login/login';
import { Result } from './domains/results/pages/result/result';
import { CreateTournament } from './domains/results/pages/create-tournament/create-tournament';
import { CreateFootballTeam } from './domains/sports/pages/create-football-team/create-football-team';
import { SelectTypeSportTeam } from './domains/sports/pages/select-type-sport-team/select-type-sport-team';
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: Homepage,
  },
  {
    path: 'tutorial',
    component: Tutorial,
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

  {
    path: 'create-football-team',
    component: CreateFootballTeam,
  },
  {
    path: 'select-type-sport-team',
    component: SelectTypeSportTeam,
  },
  {
    path: 'create-team',
    component: CreateFootballTeam,
  }
];
