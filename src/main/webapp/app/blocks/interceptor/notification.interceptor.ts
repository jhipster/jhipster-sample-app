import { JhiAlertService } from 'ng-jhipster';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

export class NotificationInterceptor implements HttpInterceptor {
  private alertService: JhiAlertService;

  // tslint:disable-next-line: no-unused-variable
  constructor(private injector: Injector) {
    setTimeout(() => (this.alertService = injector.get(JhiAlertService)));
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).do(
      (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const arr = event.headers.keys();
          let alert = null;
          let alertParams = null;
          arr.forEach(entry => {
            if (entry.endsWith('app-alert')) {
              alert = event.headers.get(entry);
            } else if (entry.endsWith('app-params')) {
              alertParams = event.headers.get(entry);
            }
          });
          if (alert) {
            if (typeof alert === 'string') {
              if (this.alertService) {
                this.alertService.success(alert, { param: alertParams }, null);
              }
            }
          }
        }
      },
      (err: any) => {}
    );
  }
}
