import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';

import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';

import { AlertModel, AlertService } from 'app/core/util/alert.service';

@Component({
  selector: 'jhi-alert',
  templateUrl: './alert.html',
  imports: [NgbAlert],
})
export class Alert implements OnInit, OnDestroy {
  readonly alerts = signal<AlertModel[]>([]);

  private readonly alertService = inject(AlertService);

  ngOnInit(): void {
    this.alerts.set(this.alertService.get());
  }

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
    alert.close?.(this.alerts());
  }
}
