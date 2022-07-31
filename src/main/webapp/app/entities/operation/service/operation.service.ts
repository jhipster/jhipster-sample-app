import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOperation, NewOperation } from '../operation.model';

export type PartialUpdateOperation = Partial<IOperation> & Pick<IOperation, 'id'>;

type RestOf<T extends IOperation | NewOperation> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestOperation = RestOf<IOperation>;

export type NewRestOperation = RestOf<NewOperation>;

export type PartialUpdateRestOperation = RestOf<PartialUpdateOperation>;

export type EntityResponseType = HttpResponse<IOperation>;
export type EntityArrayResponseType = HttpResponse<IOperation[]>;

@Injectable({ providedIn: 'root' })
export class OperationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/operations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(operation: NewOperation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(operation);
    return this.http
      .post<RestOperation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(operation: IOperation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(operation);
    return this.http
      .put<RestOperation>(`${this.resourceUrl}/${this.getOperationIdentifier(operation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(operation: PartialUpdateOperation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(operation);
    return this.http
      .patch<RestOperation>(`${this.resourceUrl}/${this.getOperationIdentifier(operation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestOperation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestOperation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOperationIdentifier(operation: Pick<IOperation, 'id'>): number {
    return operation.id;
  }

  compareOperation(o1: Pick<IOperation, 'id'> | null, o2: Pick<IOperation, 'id'> | null): boolean {
    return o1 && o2 ? this.getOperationIdentifier(o1) === this.getOperationIdentifier(o2) : o1 === o2;
  }

  addOperationToCollectionIfMissing<Type extends Pick<IOperation, 'id'>>(
    operationCollection: Type[],
    ...operationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const operations: Type[] = operationsToCheck.filter(isPresent);
    if (operations.length > 0) {
      const operationCollectionIdentifiers = operationCollection.map(operationItem => this.getOperationIdentifier(operationItem)!);
      const operationsToAdd = operations.filter(operationItem => {
        const operationIdentifier = this.getOperationIdentifier(operationItem);
        if (operationCollectionIdentifiers.includes(operationIdentifier)) {
          return false;
        }
        operationCollectionIdentifiers.push(operationIdentifier);
        return true;
      });
      return [...operationsToAdd, ...operationCollection];
    }
    return operationCollection;
  }

  protected convertDateFromClient<T extends IOperation | NewOperation | PartialUpdateOperation>(operation: T): RestOf<T> {
    return {
      ...operation,
      date: operation.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restOperation: RestOperation): IOperation {
    return {
      ...restOperation,
      date: restOperation.date ? dayjs(restOperation.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestOperation>): HttpResponse<IOperation> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestOperation[]>): HttpResponse<IOperation[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
