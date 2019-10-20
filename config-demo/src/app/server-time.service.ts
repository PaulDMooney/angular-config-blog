import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServerTimeService {

  constructor(private httpClient: HttpClient) { }

  getTime(): Observable<string> {

    return this.httpClient.get('/api/servertime')
      .pipe(map((data: any) => data.servertime));
  }
}
