import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { serverApiUrl } from 'app/config';

import { Level, LoggersResponse } from './log.model';

@Service()
export class LogsService {
  private readonly http = inject(HttpClient);

  changeLevel(name: string, configuredLevel: Level): Observable<{}> {
    return this.http.post(`${serverApiUrl}management/loggers/${name}`, { configuredLevel });
  }

  findAll(): Observable<LoggersResponse> {
    return this.http.get<LoggersResponse>(`${serverApiUrl}management/loggers`);
  }
}
