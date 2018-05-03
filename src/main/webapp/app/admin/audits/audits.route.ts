import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { AuditsComponent } from './audits.component';

@Injectable()
export class AuditResolvePagingParams implements Resolve<any> {
    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'auditEventDate,desc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
        };
    }
}

export const auditsRoute: Route = {
    path: 'audits',
    component: AuditsComponent,
    resolve: {
        pagingParams: AuditResolvePagingParams
    },
    data: {
        pageTitle: 'audits.title'
    }
};
