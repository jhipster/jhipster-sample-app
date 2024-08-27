import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Level, LoggersResponse } from './log.model';

@Injectable({ providedIn: 'root' })
export class LogsService {
  private http = inject(HttpClient);
  private applicationConfigService = inject(ApplicationConfigService);

  changeLevel(name: string, configuredLevel: Level): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor(`management/loggers/${name}`), { configuredLevel });
  }

  findAll(): Observable<LoggersResponse> {
    return this.http.get<LoggersResponse>(this.applicationConfigService.getEndpointFor('management/loggers'));
  }
}
