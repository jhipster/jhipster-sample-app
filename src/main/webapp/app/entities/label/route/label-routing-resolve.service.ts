import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILabel } from '../label.model';
import { LabelService } from '../service/label.service';

@Injectable({ providedIn: 'root' })
export class LabelRoutingResolveService implements Resolve<ILabel | null> {
  constructor(protected service: LabelService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILabel | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((label: HttpResponse<ILabel>) => {
          if (label.body) {
            return of(label.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
