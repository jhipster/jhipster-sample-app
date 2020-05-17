import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IOperation } from 'app/shared/model/operation.model';

type EntityResponseType = HttpResponse<IOperation>;
type EntityArrayResponseType = HttpResponse<IOperation[]>;

@Injectable({ providedIn: 'root' })
export class OperationService {
  public resourceUrl = SERVER_API_URL + 'api/operations';

  constructor(protected http: HttpClient) {}

  create(operation: IOperation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(operation);
    return this.http
      .post<IOperation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(operation: IOperation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(operation);
    return this.http
      .put<IOperation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOperation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOperation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(operation: IOperation): IOperation {
    const copy: IOperation = Object.assign({}, operation, {
      date: operation.date && operation.date.isValid() ? operation.date.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? moment(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((operation: IOperation) => {
        operation.date = operation.date ? moment(operation.date) : undefined;
      });
    }
    return res;
  }
}
