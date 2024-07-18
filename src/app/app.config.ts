import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(),
    provideAnimationsAsync(), 
    provideHttpClient(),    
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      progressBar: true, // Duración en milisegundos
      positionClass: 'toast-top-right', // Posición de la notificación
      preventDuplicates: false, // Prevenir duplicados
      closeButton: true, // Mostrar botón de cerrar
    }),
    ]
};
