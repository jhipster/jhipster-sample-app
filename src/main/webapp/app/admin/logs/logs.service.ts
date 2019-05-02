import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class LogsService {
  constructor(private http: HttpClient) {}

  changeLevel(name: string, configuredLevel: string): Observable<HttpResponse<any>> {
    return this.http.post(SERVER_API_URL + 'management/loggers/' + name, { configuredLevel }, { observe: 'response' });
  }

  findAll(): Observable<HttpResponse<any>> {
    return this.http.get<any>(SERVER_API_URL + 'management/loggers', { observe: 'response' });
  }
}
