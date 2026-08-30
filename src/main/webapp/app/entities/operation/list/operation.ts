import { HttpHeaders } from '@angular/common/http';
import { Component, WritableSignal, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Data, ParamMap, Router, RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { combineLatest, filter, map, tap } from 'rxjs';

import { DEFAULT_SORT_DATA, ITEMS_PER_PAGE, ITEM_DELETED_EVENT, SORT } from 'app/config';
import { ParseLinks } from 'app/core/util';
import { Alert, AlertError } from 'app/shared/alert';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { TranslateDirective } from 'app/shared/language';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { OperationDeleteDialog } from '../delete/operation-delete-dialog';
import { IOperation } from '../operation.model';
import { OperationService } from '../service/operation.service';

@Component({
  selector: 'jhi-operation',
  templateUrl: './operation.html',
  imports: [
    RouterLink,
    FontAwesomeModule,
    AlertError,
    Alert,
    SortDirective,
    SortByDirective,
    TranslateDirective,
    FormatMediumDatetimePipe,
    InfiniteScrollDirective,
  ],
})
export class Operation {
  readonly operations = signal<IOperation[]>([]);

  sortState = sortStateSignal({});

  readonly itemsPerPage = signal(ITEMS_PER_PAGE);
  readonly links: WritableSignal<Record<string, undefined | Record<string, string | undefined>>> = signal({});
  readonly hasMorePage = computed(() => !!this.links().next);
  readonly isFirstFetch = computed(() => Object.keys(this.links()).length === 0);

  readonly router = inject(Router);
  protected readonly operationService = inject(OperationService);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly isLoading = this.operationService.operationsResource.isLoading;
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly activatedRouteState = toSignal(
    combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      map(([queryParamMap, data]) => ({ queryParamMap, data })),
    ),
    { initialValue: { queryParamMap: this.activatedRoute.snapshot.queryParamMap, data: this.activatedRoute.snapshot.data } },
  );
  protected readonly sortService = inject(SortService);
  protected parseLinks = inject(ParseLinks);
  protected modalService = inject(NgbModal);

  constructor() {
    effect(() => {
      const headers = this.operationService.operationsResource.headers();
      if (headers) {
        this.fillComponentAttributesFromResponseHeader(headers);
      }
    });
    effect(() => {
      this.operations.update(operations =>
        this.fillComponentAttributesFromResponseBody([...this.operationService.operations()], operations),
      );
    });
    effect(() => {
      const activatedRouteState = this.activatedRouteState();
      untracked(() => {
        // Only watch for route changes. Other signals should be ignored.
        this.fillComponentAttributeFromRoute(activatedRouteState.queryParamMap, activatedRouteState.data);
        this.reset();
        this.load();
      });
    });
  }

  trackId = (item: IOperation): number => this.operationService.getOperationIdentifier(item);

  reset(): void {
    this.operations.set([]);
    this.links.set({});
  }

  loadNextPage(): void {
    this.load();
  }

  delete(operation: IOperation): void {
    const modalRef = this.modalService.open(OperationDeleteDialog, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.operation = operation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.queryBackend();
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected fillComponentAttributesFromResponseBody(data: IOperation[], currentValue: IOperation[]): IOperation[] {
    const operationsNew = [...currentValue];
    for (const d of data) {
      if (!operationsNew.some(op => op.id === d.id)) {
        operationsNew.push(d);
      }
    }
    return operationsNew;
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    const linkHeader = headers.get('link');
    if (linkHeader) {
      this.links.set(this.parseLinks.parseAll(linkHeader));
    } else {
      this.links.set({});
    }
  }

  protected queryBackend(): void {
    const queryObject: any = {
      size: this.itemsPerPage(),
      eagerload: true,
    };
    if (this.hasMorePage()) {
      Object.assign(queryObject, this.links().next);
    } else if (this.isFirstFetch()) {
      Object.assign(queryObject, { sort: this.sortService.buildSortParam(this.sortState()) });
    }

    this.operationService.operationsParams.set(queryObject);
  }

  protected handleNavigation(sortState: SortState): void {
    this.links.set({});

    const queryParamsObj = {
      sort: this.sortService.buildSortParam(sortState),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }
}
