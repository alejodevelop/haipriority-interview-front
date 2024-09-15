import {Routes} from '@angular/router';
import {authGuard, loggedGuard} from './middlewares/guards/auth.guards';
import {HomeComponent} from "./pages/home/home.component";
import {LogInComponent} from "./pages/log-in/log-in.component";
import {SignUpComponent} from "./pages/sign-up/sign-up.component";
import {LayoutComponent} from './shared/components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
        title: 'Home',
      },
    ],
  },
  {
    path: 'login',
    component: LogInComponent,
    canActivate: [loggedGuard],
    title: 'Log In',
  },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [loggedGuard],
    title: 'Sign Up',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
