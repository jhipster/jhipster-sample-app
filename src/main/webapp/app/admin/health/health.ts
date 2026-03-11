import { KeyValuePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';

import { TranslateDirective } from 'app/shared/language';

import { HealthDetails, HealthModel, HealthStatus } from './health.model';
import { HealthService } from './health.service';
import HealthModal from './modal/health-modal';

@Component({
  selector: 'jhi-health',
  templateUrl: './health.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, KeyValuePipe],
})
export default class Health implements OnInit {
  readonly health = signal<HealthModel | null>(null);

  private readonly modalService = inject(NgbModal);
  private readonly healthService = inject(HealthService);

  ngOnInit(): void {
    this.refresh();
  }

  getBadgeClass(statusState: HealthStatus): string {
    if (statusState === 'UP') {
      return 'bg-success';
    }
    return 'bg-danger';
  }

  refresh(): void {
    this.healthService.checkHealth().subscribe({
      next: health => this.health.set(health),
      error: (error: HttpErrorResponse) => {
        if (error.status === 503) {
          this.health.set(error.error);
        }
      },
    });
  }

  showHealth(health: { key: string; value: HealthDetails }): void {
    const modalRef = this.modalService.open(HealthModal);
    modalRef.componentInstance.health = health;
  }
}
