import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class CSRFService {
    constructor(private cookieService: CookieService) {}

    getCSRF(name?: string) {
        name = `${name ? name : 'XSRF-TOKEN'}`;
        return this.cookieService.get(name);
    }
}
