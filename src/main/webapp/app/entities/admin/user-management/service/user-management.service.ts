import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { IUserManagement } from '../user-management.model';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  private readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/admin/users');

  create(user: IUserManagement): Observable<IUserManagement> {
    return this.http.post<IUserManagement>(this.resourceUrl, user);
  }

  update(user: IUserManagement): Observable<IUserManagement> {
    return this.http.put<IUserManagement>(this.resourceUrl, user);
  }

  find(login: string): Observable<IUserManagement> {
    return this.http.get<IUserManagement>(`${this.resourceUrl}/${encodeURIComponent(login)}`);
  }

  query(req?: Pagination): Observable<HttpResponse<IUserManagement[]>> {
    const options = createRequestOption(req);
    return this.http.get<IUserManagement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(login: string): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(login)}`);
  }
}
