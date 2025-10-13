import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(), // <-- ¡ESTA ES LA LÍNEA CORRECTA PARA UNA APP SIN ZONE.JS!
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp({
      projectId: "inksync-tatuajes",
      appId: "1:573339127867:web:3cf5b01c4ba81ef867cc1e",
      storageBucket: "inksync-tatuajes.appspot.com",
      apiKey: "AIzaSyD99vY094V3XhFFHJk_zLtD-nNENmHmXno",
      authDomain: "inksync-tatuajes.firebaseapp.com",
      messagingSenderId: "573339127867"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ]
};
