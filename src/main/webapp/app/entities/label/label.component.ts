import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ILabel } from 'app/shared/model/label.model';
import { AccountService } from 'app/core';
import { LabelService } from './label.service';

@Component({
  selector: 'jhi-label',
  templateUrl: './label.component.html'
})
export class LabelComponent implements OnInit, OnDestroy {
  labels: ILabel[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected labelService: LabelService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.labelService
      .query()
      .pipe(
        filter((res: HttpResponse<ILabel[]>) => res.ok),
        map((res: HttpResponse<ILabel[]>) => res.body)
      )
      .subscribe(
        (res: ILabel[]) => {
          this.labels = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInLabels();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ILabel) {
    return item.id;
  }

  registerChangeInLabels() {
    this.eventSubscriber = this.eventManager.subscribe('labelListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
