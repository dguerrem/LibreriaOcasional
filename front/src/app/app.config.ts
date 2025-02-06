import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

// IMPORTS NECESARIOS PARA TOASTR
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        timeOut: 3000, // Duración de la notificación
        positionClass: 'toast-top-right', // Posición de los mensajes
        preventDuplicates: true, // Evita duplicados
        progressBar: true // Muestra barra de progreso
      })
    )
  ],
};
