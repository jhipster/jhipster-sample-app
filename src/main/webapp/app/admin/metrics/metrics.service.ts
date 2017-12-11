import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

@Injectable()
export class JhiMetricsService {

    constructor(private http: Http) {}

    getMetrics(): Observable<any> {
        return this.http.get(SERVER_API_URL + 'management/metrics').map((res: Response) => res.json());
    }

    threadDump(): Observable<any> {
        return this.http.get(SERVER_API_URL + 'management/dump').map((res: Response) => res.json());
    }
}
