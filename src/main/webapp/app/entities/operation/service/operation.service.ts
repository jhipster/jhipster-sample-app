import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOperation, getOperationIdentifier } from '../operation.model';

export type EntityResponseType = HttpResponse<IOperation>;
export type EntityArrayResponseType = HttpResponse<IOperation[]>;

@Injectable({ providedIn: 'root' })
export class OperationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/operations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(operation: IOperation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(operation);
    return this.http
      .post<IOperation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(operation: IOperation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(operation);
    return this.http
      .put<IOperation>(`${this.resourceUrl}/${getOperationIdentifier(operation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(operation: IOperation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(operation);
    return this.http
      .patch<IOperation>(`${this.resourceUrl}/${getOperationIdentifier(operation) as number}`, copy, { observe: 'response' })
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

  addOperationToCollectionIfMissing(
    operationCollection: IOperation[],
    ...operationsToCheck: (IOperation | null | undefined)[]
  ): IOperation[] {
    const operations: IOperation[] = operationsToCheck.filter(isPresent);
    if (operations.length > 0) {
      const operationCollectionIdentifiers = operationCollection.map(operationItem => getOperationIdentifier(operationItem)!);
      const operationsToAdd = operations.filter(operationItem => {
        const operationIdentifier = getOperationIdentifier(operationItem);
        if (operationIdentifier == null || operationCollectionIdentifiers.includes(operationIdentifier)) {
          return false;
        }
        operationCollectionIdentifiers.push(operationIdentifier);
        return true;
      });
      return [...operationsToAdd, ...operationCollection];
    }
    return operationCollection;
  }

  protected convertDateFromClient(operation: IOperation): IOperation {
    return Object.assign({}, operation, {
      date: operation.date?.isValid() ? operation.date.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((operation: IOperation) => {
        operation.date = operation.date ? dayjs(operation.date) : undefined;
      });
    }
    return res;
  }
}
