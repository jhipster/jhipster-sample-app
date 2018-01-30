import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Label } from './label.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Label>;

@Injectable()
export class LabelService {

    private resourceUrl =  SERVER_API_URL + 'api/labels';

    constructor(private http: HttpClient) { }

    create(label: Label): Observable<EntityResponseType> {
        const copy = this.convert(label);
        return this.http.post<Label>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(label: Label): Observable<EntityResponseType> {
        const copy = this.convert(label);
        return this.http.put<Label>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Label>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Label[]>> {
        const options = createRequestOption(req);
        return this.http.get<Label[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Label[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Label = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Label[]>): HttpResponse<Label[]> {
        const jsonResponse: Label[] = res.body;
        const body: Label[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Label.
     */
    private convertItemFromServer(label: Label): Label {
        const copy: Label = Object.assign({}, label);
        return copy;
    }

    /**
     * Convert a Label to a JSON which can be sent to the server.
     */
    private convert(label: Label): Label {
        const copy: Label = Object.assign({}, label);
        return copy;
    }
}
