import { Component, OnDestroy, inject } from '@angular/core';

import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';

import { AlertModel, AlertService } from 'app/core/util';

@Component({
  selector: 'jhi-alert',
  templateUrl: './alert.html',
  imports: [NgbAlert],
})
export class Alert implements OnDestroy {
  readonly alerts = inject(AlertService).alerts;

  private readonly alertService = inject(AlertService);

  setClasses(alert: AlertModel): Record<string, boolean> {
    const classes = { 'jhi-toast': Boolean(alert.toast) };
    if (alert.position) {
      return { ...classes, [alert.position]: true };
    }
    return classes;
  }

  ngOnDestroy(): void {
    this.alertService.clear();
  }

  close(alert: AlertModel): void {
    alert.close?.();
  }
}
