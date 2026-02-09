import "@angular/compiler";
import { bootstrapApplication, provideProtractorTestingSupport } from "@angular/platform-browser";
import { AppComponent } from "./src/app.component";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, withHashLocation } from '@angular/router';
import { provideZonelessChangeDetection } from "@angular/core";
import { APP_ROUTES } from "./src/app.routes";

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideAnimations(),
    provideRouter(APP_ROUTES, withHashLocation()),
    // Add other providers as needed
  ],
}).catch((err) => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
