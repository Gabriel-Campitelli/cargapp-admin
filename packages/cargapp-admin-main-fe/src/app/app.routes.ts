import { Routes } from '@angular/router';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: WrapperComponent,
    children: [
      {
        path: 'home',
        component: AdminDashboardComponent,
      },

      { path: '**', redirectTo: 'home' },
    ],
  },
  { path: '**', redirectTo: '' },
];
