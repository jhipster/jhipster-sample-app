import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IOperation, NewOperation } from '../operation.model';

export type PartialUpdateOperation = Partial<IOperation> & Pick<IOperation, 'id'>;

type RestOf<T extends IOperation | NewOperation> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestOperation = RestOf<IOperation>;

export type NewRestOperation = RestOf<NewOperation>;

export type PartialUpdateRestOperation = RestOf<PartialUpdateOperation>;

@Injectable()
export class OperationsService {
  readonly operationsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly operationsResource = httpResource<RestOperation[]>(() => {
    const params = this.operationsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of operation that have been fetched. It is updated when the operationsResource emits a new value.
   * In case of error while fetching the operations, the signal is set to an empty array.
   */
  readonly operations = computed(() =>
    (this.operationsResource.hasValue() ? this.operationsResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/operations');

  protected convertValueFromServer(restOperation: RestOperation): IOperation {
    return {
      ...restOperation,
      date: restOperation.date ? dayjs(restOperation.date) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class OperationService extends OperationsService {
  protected readonly http = inject(HttpClient);

  create(operation: NewOperation): Observable<IOperation> {
    const copy = this.convertValueFromClient(operation);
    return this.http.post<RestOperation>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(operation: IOperation): Observable<IOperation> {
    const copy = this.convertValueFromClient(operation);
    return this.http
      .put<RestOperation>(`${this.resourceUrl}/${encodeURIComponent(this.getOperationIdentifier(operation))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(operation: PartialUpdateOperation): Observable<IOperation> {
    const copy = this.convertValueFromClient(operation);
    return this.http
      .patch<RestOperation>(`${this.resourceUrl}/${encodeURIComponent(this.getOperationIdentifier(operation))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IOperation> {
    return this.http
      .get<RestOperation>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IOperation[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestOperation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
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
      const operationCollectionIdentifiers = operationCollection.map(operationItem => this.getOperationIdentifier(operationItem));
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

  protected convertValueFromClient<T extends IOperation | NewOperation | PartialUpdateOperation>(operation: T): RestOf<T> {
    return {
      ...operation,
      date: operation.date?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestOperation): IOperation {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestOperation[]): IOperation[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
