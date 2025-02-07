import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { LibreriaComponent } from './libreria/libreria.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { LoginComponent } from './login/login.component';
import { PerfilComponent } from './perfil/perfil.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
    },
    {
        path: 'inicio',
        component: InicioComponent,
    },
    {
        path: 'libreria',
        component: LibreriaComponent,
    },
    {
        path: 'estadisticas',
        component: EstadisticasComponent,
    },
    {
        path: 'perfil',
        component: PerfilComponent
    },
    {
        path: '**',
        redirectTo: ""
    }
];
