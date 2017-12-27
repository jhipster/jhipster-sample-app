import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

@Injectable()
export class AuditsService  {
    constructor(private http: Http) { }

    query(req: any): Observable<Response> {
        const params: URLSearchParams = new URLSearchParams();
        params.set('fromDate', req.fromDate);
        params.set('toDate', req.toDate);
        params.set('page', req.page);
        params.set('size', req.size);
        params.set('sort', req.sort);

        const options = {
            search: params
        };

        return this.http.get(SERVER_API_URL + 'management/audits', options);
    }
}
