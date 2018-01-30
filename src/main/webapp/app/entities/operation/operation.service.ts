import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Operation } from './operation.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Operation>;

@Injectable()
export class OperationService {

    private resourceUrl =  SERVER_API_URL + 'api/operations';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(operation: Operation): Observable<EntityResponseType> {
        const copy = this.convert(operation);
        return this.http.post<Operation>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(operation: Operation): Observable<EntityResponseType> {
        const copy = this.convert(operation);
        return this.http.put<Operation>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Operation>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Operation[]>> {
        const options = createRequestOption(req);
        return this.http.get<Operation[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Operation[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Operation = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Operation[]>): HttpResponse<Operation[]> {
        const jsonResponse: Operation[] = res.body;
        const body: Operation[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Operation.
     */
    private convertItemFromServer(operation: Operation): Operation {
        const copy: Operation = Object.assign({}, operation);
        copy.date = this.dateUtils
            .convertDateTimeFromServer(operation.date);
        return copy;
    }

    /**
     * Convert a Operation to a JSON which can be sent to the server.
     */
    private convert(operation: Operation): Operation {
        const copy: Operation = Object.assign({}, operation);

        copy.date = this.dateUtils.toDate(operation.date);
        return copy;
    }
}
