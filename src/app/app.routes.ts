import { Routes } from '@angular/router';
import { UsersModule } from './users/users-module';
import { Leaflet } from './leaflet/leaflet';

export const routes: Routes = [
    // {
    //     path: '', redirectTo: 'home', pathMatch: 'full',
    // },
    {
        path: '', loadChildren: () => UsersModule
    },
    {
        path: 'leaflet', component: Leaflet
    }
];
