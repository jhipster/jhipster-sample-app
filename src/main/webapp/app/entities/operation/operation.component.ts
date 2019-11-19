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
  eventSubscriber: Subscription;
  itemsPerPage: number;
  links: any;
  page: any;
  predicate: any;
  reverse: any;
  totalItems: number;

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
    this.reverse = true;
  }

  loadAll() {
    this.operationService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe((res: HttpResponse<IOperation[]>) => this.paginateOperations(res.body, res.headers));
  }

  reset() {
    this.page = 0;
    this.operations = [];
    this.loadAll();
  }

  loadPage(page) {
    this.page = page;
    this.loadAll();
  }

  ngOnInit() {
    this.loadAll();
    this.registerChangeInOperations();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IOperation) {
    return item.id;
  }

  registerChangeInOperations() {
    this.eventSubscriber = this.eventManager.subscribe('operationListModification', () => this.reset());
  }

  delete(operation: IOperation) {
    const modalRef = this.modalService.open(OperationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.operation = operation;
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateOperations(data: IOperation[], headers: HttpHeaders) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    for (let i = 0; i < data.length; i++) {
      this.operations.push(data[i]);
    }
  }
}
