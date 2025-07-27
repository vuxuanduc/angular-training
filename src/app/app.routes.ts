import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', redirectTo: '/users', pathMatch: 'full'
    },
    {
        path: 'users',
        loadChildren: () => import('./features/users/users').then(m => m.UsersModule)
    }
];
