import { Routes } from '@angular/router';
import { Users } from './users/users';

export const routes: Routes = [
    {
        path: '', redirectTo: 'home', pathMatch: 'full',
    },
    {
        path: 'users', loadChildren: () => import('./users/users-module').then(m => m.UsersModule)
    }
];
