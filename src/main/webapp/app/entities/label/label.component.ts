import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ILabel } from 'app/shared/model/label.model';
import { LabelService } from './label.service';

@Component({
  selector: 'jhi-label',
  templateUrl: './label.component.html'
})
export class LabelComponent implements OnInit, OnDestroy {
  labels: ILabel[];
  eventSubscriber: Subscription;

  constructor(protected labelService: LabelService, protected eventManager: JhiEventManager) {}

  loadAll() {
    this.labelService.query().subscribe((res: HttpResponse<ILabel[]>) => {
      this.labels = res.body;
    });
  }

  ngOnInit() {
    this.loadAll();
    this.registerChangeInLabels();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ILabel) {
    return item.id;
  }

  registerChangeInLabels() {
    this.eventSubscriber = this.eventManager.subscribe('labelListModification', () => this.loadAll());
  }
}
