import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

@Injectable()
export class Register {

    constructor(private http: Http) {}

    save(account: any): Observable<any> {
        return this.http.post(SERVER_API_URL + 'api/register', account);
    }
}
