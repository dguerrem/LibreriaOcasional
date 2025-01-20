import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { LibreriaComponent } from './libreria/libreria.component';

export const routes: Routes = [
    {
        path: '',
        component: InicioComponent,
        pathMatch: 'full'
    },
    {
        path: 'libreria',
        component: LibreriaComponent,
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: ""
    }
];
