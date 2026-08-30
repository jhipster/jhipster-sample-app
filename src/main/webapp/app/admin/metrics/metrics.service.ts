import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { serverApiUrl } from 'app/config';

import { MetricsModel, ThreadDump } from './metrics.model';

@Service()
export class MetricsService {
  private readonly http = inject(HttpClient);

  getMetrics(): Observable<MetricsModel> {
    return this.http.get<MetricsModel>(`${serverApiUrl}management/jhimetrics`);
  }

  threadDump(): Observable<ThreadDump> {
    return this.http.get<ThreadDump>(`${serverApiUrl}management/threaddump`);
  }
}
