import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IOperation } from 'app/shared/model/operation.model';

export type EntityResponseType = HttpResponse<IOperation>;
export type EntityArrayResponseType = HttpResponse<IOperation[]>;

@Injectable()
export class OperationService {
  private resourceUrl = SERVER_API_URL + 'api/operations';

  constructor(private http: HttpClient) {}

  create(operation: IOperation): Observable<EntityResponseType> {
    const copy = this.convert(operation);
    return this.http
      .post<IOperation>(this.resourceUrl, copy, { observe: 'response' })
      .map((res: EntityResponseType) => this.convertResponse(res));
  }

  update(operation: IOperation): Observable<EntityResponseType> {
    const copy = this.convert(operation);
    return this.http
      .put<IOperation>(this.resourceUrl, copy, { observe: 'response' })
      .map((res: EntityResponseType) => this.convertResponse(res));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOperation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .map((res: EntityResponseType) => this.convertResponse(res));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOperation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .map((res: EntityArrayResponseType) => this.convertArrayResponse(res));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  private convertResponse(res: EntityResponseType): EntityResponseType {
    const body: IOperation = this.convertItemFromServer(res.body);
    return res.clone({ body });
  }

  private convertArrayResponse(res: EntityArrayResponseType): EntityArrayResponseType {
    const jsonResponse: IOperation[] = res.body;
    const body: IOperation[] = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      body.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return res.clone({ body });
  }

  /**
   * Convert a returned JSON object to Operation.
   */
  private convertItemFromServer(operation: IOperation): IOperation {
    const copy: IOperation = Object.assign({}, operation, {
      date: operation.date != null ? moment(operation.date) : operation.date
    });
    return copy;
  }

  /**
   * Convert a Operation to a JSON which can be sent to the server.
   */
  private convert(operation: IOperation): IOperation {
    const copy: IOperation = Object.assign({}, operation, {
      date: operation.date != null && operation.date.isValid() ? operation.date.toJSON() : null
    });
    return copy;
  }
}
