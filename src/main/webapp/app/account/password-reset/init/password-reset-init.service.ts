import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../../app.constants';

@Injectable()
export class PasswordResetInitService {

    constructor(private http: Http) {}

    save(mail: string): Observable<any> {
        return this.http.post(SERVER_API_URL + 'api/account/reset-password/init', mail);
    }
}
