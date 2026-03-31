import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { SignupComponent } from './auth/signup/signup';
import { DashboardComponent } from './dashboard/dashboard';

export const routes: Routes = [
  { path: 'login',            component: LoginComponent },
  { path: 'signup',           component: SignupComponent },
  { path: 'dashboard',        component: DashboardComponent },
  { path: 'oauth2/success',   component: DashboardComponent },  // OAuth2 redirect lands here
  { path: '',                 redirectTo: 'login', pathMatch: 'full' }
];