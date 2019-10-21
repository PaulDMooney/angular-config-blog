import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isPlatformServer } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private httpClient: HttpClient, @Inject(PLATFORM_ID) private platformId) {}

  getConfig(): Observable<any> {

    // Direct access to environment variables when on server.
    if (isPlatformServer(this.platformId)) {
      return of({
        DEBOUNCE_TIME: process.env.DEBOUNCE_TIME
      });
    }

    // Otherwise call the `/config` API.
    return this.httpClient.get('/config');
  }
}
