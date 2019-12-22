import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOperation } from 'app/shared/model/operation.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { OperationService } from './operation.service';
import { OperationDeleteDialogComponent } from './operation-delete-dialog.component';

@Component({
  selector: 'jhi-operation',
  templateUrl: './operation.component.html'
})
export class OperationComponent implements OnInit, OnDestroy {
  operations: IOperation[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected operationService: OperationService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks
  ) {
    this.operations = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.operationService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe((res: HttpResponse<IOperation[]>) => this.paginateOperations(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.operations = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInOperations();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IOperation): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInOperations(): void {
    this.eventSubscriber = this.eventManager.subscribe('operationListModification', () => this.reset());
  }

  delete(operation: IOperation): void {
    const modalRef = this.modalService.open(OperationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.operation = operation;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateOperations(data: IOperation[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.operations.push(data[i]);
      }
    }
  }
}
