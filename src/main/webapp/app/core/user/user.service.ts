import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { IPublicUser, IUser } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  public resourceUrl = SERVER_API_URL + 'api/users';
  public userManagementUrl = SERVER_API_URL + 'api/admin/users';

  constructor(private http: HttpClient) {}

  create(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.userManagementUrl, user);
  }

  update(user: IUser): Observable<IUser> {
    return this.http.put<IUser>(this.userManagementUrl, user);
  }

  find(login: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.userManagementUrl}/${login}`);
  }

  query(req?: Pagination): Observable<HttpResponse<IPublicUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IPublicUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  queryAsAdmin(req?: Pagination): Observable<HttpResponse<IUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(this.userManagementUrl, { params: options, observe: 'response' });
  }

  delete(login: string): Observable<{}> {
    return this.http.delete(`${this.userManagementUrl}/${login}`);
  }

  authorities(): Observable<string[]> {
    return this.http.get<string[]>(SERVER_API_URL + 'api/authorities');
  }
}
