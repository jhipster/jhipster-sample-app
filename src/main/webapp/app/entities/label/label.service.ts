import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Label } from './label.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class LabelService {

    private resourceUrl =  SERVER_API_URL + 'api/labels';

    constructor(private http: Http) { }

    create(label: Label): Observable<Label> {
        const copy = this.convert(label);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(label: Label): Observable<Label> {
        const copy = this.convert(label);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Label> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Label.
     */
    private convertItemFromServer(json: any): Label {
        const entity: Label = Object.assign(new Label(), json);
        return entity;
    }

    /**
     * Convert a Label to a JSON which can be sent to the server.
     */
    private convert(label: Label): Label {
        const copy: Label = Object.assign({}, label);
        return copy;
    }
}
