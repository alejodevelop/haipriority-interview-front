import {Routes} from '@angular/router';
import {authGuard, loggedGuard} from './middlewares/guards/auth.guards';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {DebitComponent} from "./pages/debit/debit.component";
import {LogInComponent} from "./pages/log-in/log-in.component";
import {SignUpComponent} from "./pages/sign-up/sign-up.component";
import {LayoutComponent} from './shared/components/layout/layout.component';
import {CreditComponent} from "./pages/credit/credit.component";
import {LoanComponent} from "./pages/loan/loan.component";
import {PayComponent} from "./pages/pay/pay.component";

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Dashboard',
      },
      {
        path: 'debit',
        component: DebitComponent,
        title: 'Debit cards',
      },
      {
        path: 'credit',
        component: CreditComponent,
        title: 'Credit cards',
      },
      {
        path: 'loan',
        component: LoanComponent,
        title: 'Loans',
      },
      {
        path: 'pay',
        component: PayComponent,
        title: 'Payments',
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
    redirectTo: 'dashboard',
  },
];
