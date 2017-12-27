import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

@Injectable()
export class PasswordService {

    constructor(private http: Http) {}

    save(newPassword: string): Observable<any> {
        return this.http.post(SERVER_API_URL + 'api/account/change-password', newPassword);
    }
}
