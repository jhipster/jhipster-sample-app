import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IOperation } from 'app/shared/model/operation.model';

type EntityResponseType = HttpResponse<IOperation>;
type EntityArrayResponseType = HttpResponse<IOperation[]>;

@Injectable()
export class OperationService {
    private resourceUrl = SERVER_API_URL + 'api/operations';

    constructor(private http: HttpClient) {}

    create(operation: IOperation): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(operation);
        return this.http
            .post<IOperation>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertDateFromServer(res));
    }

    update(operation: IOperation): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(operation);
        return this.http
            .put<IOperation>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertDateFromServer(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IOperation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertDateFromServer(res));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IOperation[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    private convertDateFromClient(operation: IOperation): IOperation {
        const copy: IOperation = Object.assign({}, operation, {
            date: operation.date != null && operation.date.isValid() ? operation.date.toJSON() : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.date = res.body.date != null ? moment(res.body.date) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((operation: IOperation) => {
            operation.date = operation.date != null ? moment(operation.date) : null;
        });
        return res;
    }
}
