import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ServerTimeService {

  constructor(private httpClient: HttpClient, @Inject(PLATFORM_ID) private platformId) { }

  getTime(): Observable<string> {

    const path = '/api/servertime';

    // Make URL absolute only if on the server
    const url = isPlatformServer(this.platformId) ? process.env.API_SERVER + path : path;

    return this.httpClient.get(url)
      .pipe(map((data: any) => data.servertime));
  }
}
