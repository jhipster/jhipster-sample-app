import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { Registration } from './register.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient) {}

  save(registration: Registration): Observable<{}> {
    return this.http.post(SERVER_API_URL + 'api/register', registration);
  }
}
