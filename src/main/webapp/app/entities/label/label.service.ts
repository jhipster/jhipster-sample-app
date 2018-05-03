import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ILabel } from 'app/shared/model/label.model';

type EntityResponseType = HttpResponse<ILabel>;
type EntityArrayResponseType = HttpResponse<ILabel[]>;

@Injectable()
export class LabelService {
    private resourceUrl = SERVER_API_URL + 'api/labels';

    constructor(private http: HttpClient) {}

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

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
