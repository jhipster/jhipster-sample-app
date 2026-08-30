import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { serverApiUrl } from 'app/config';

import { HealthModel } from './health.model';

@Service()
export class HealthService {
  private readonly http = inject(HttpClient);

  checkHealth(): Observable<HealthModel> {
    return this.http.get<HealthModel>(`${serverApiUrl}management/health`);
  }
}
