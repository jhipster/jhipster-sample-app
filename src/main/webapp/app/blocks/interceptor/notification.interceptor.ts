import { JhiAlertService, JhiHttpInterceptor } from 'ng-jhipster';
import { RequestOptionsArgs, Response } from '@angular/http';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export class NotificationInterceptor extends JhiHttpInterceptor {

    private alertService: JhiAlertService;

    // tslint:disable-next-line: no-unused-variable
    constructor(private injector: Injector) {
        super();
        setTimeout(() => this.alertService = injector.get(JhiAlertService));
    }

    requestIntercept(options?: RequestOptionsArgs): RequestOptionsArgs {
        return options;
    }

    responseIntercept(observable: Observable<Response>): Observable<Response> {
        return observable.map((response: Response) => {
            const headers = [];
            response.headers.forEach((value, name) => {
                if (name.toLowerCase().endsWith('app-alert') || name.toLowerCase().endsWith('app-params')) {
                    headers.push(name);
                }
            });
            if (headers.length > 1) {
                headers.sort();
                const alertKey = response.headers.get(headers[ 0 ]);
                if (typeof alertKey === 'string') {
                    if (this.alertService) {
                        const alertParam = headers.length >= 2 ? response.headers.get(headers[ 1 ]) : null;
                        this.alertService.success(alertKey, { param : alertParam }, null);
                    }
                }
            }
            return response;
        }).catch((error) => {
            return Observable.throw(error); // here, response is an error
        });
    }
}
