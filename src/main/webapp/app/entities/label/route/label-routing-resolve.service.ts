import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILabel, Label } from '../label.model';
import { LabelService } from '../service/label.service';

@Injectable({ providedIn: 'root' })
export class LabelRoutingResolveService implements Resolve<ILabel> {
  constructor(private service: LabelService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILabel> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((label: HttpResponse<Label>) => {
          if (label.body) {
            return of(label.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Label());
  }
}
