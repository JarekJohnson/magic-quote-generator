import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Capture unhandled global errors
    provideBrowserGlobalErrorListeners(),
    // Performance improvement by coalescing change detection events
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Root application routes setup
    provideRouter(routes),
  ],
};
