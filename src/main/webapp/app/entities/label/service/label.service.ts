import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/core/request/request-util';
import { ILabel } from '../label.model';

type EntityResponseType = HttpResponse<ILabel>;
type EntityArrayResponseType = HttpResponse<ILabel[]>;

@Injectable({ providedIn: 'root' })
export class LabelService {
  public resourceUrl = SERVER_API_URL + 'api/labels';

  constructor(protected http: HttpClient) {}

  create(label: ILabel): Observable<EntityResponseType> {
    return this.http.post<ILabel>(this.resourceUrl, label, { observe: 'response' });
  }

  update(label: ILabel): Observable<EntityResponseType> {
    return this.http.put<ILabel>(this.resourceUrl, label, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILabel>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILabel[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
