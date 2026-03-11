import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';
import { TranslateModule } from '@ngx-translate/core';

import { Thread, ThreadState } from 'app/admin/metrics/metrics.model';
import { TranslateDirective } from 'app/shared/language';
import { MetricsModalThreads } from '../metrics-modal-threads/metrics-modal-threads';

@Component({
  selector: 'jhi-jvm-threads',
  templateUrl: './jvm-threads.html',
  imports: [NgbProgressbar, DecimalPipe, TranslateDirective, TranslateModule],
})
export class JvmThreads {
  readonly threads = input<Thread[] | undefined>();

  readonly threadStats = computed(() => {
    const stats = {
      threadDumpAll: 0,
      threadDumpRunnable: 0,
      threadDumpTimedWaiting: 0,
      threadDumpWaiting: 0,
      threadDumpBlocked: 0,
    };

    const threads = this.threads();
    if (threads) {
      for (const thread of threads) {
        if (thread.threadState === ThreadState.Runnable) {
          stats.threadDumpRunnable += 1;
        } else if (thread.threadState === ThreadState.Waiting) {
          stats.threadDumpWaiting += 1;
        } else if (thread.threadState === ThreadState.TimedWaiting) {
          stats.threadDumpTimedWaiting += 1;
        } else if (thread.threadState === ThreadState.Blocked) {
          stats.threadDumpBlocked += 1;
        }
      }
    }

    stats.threadDumpAll = stats.threadDumpRunnable + stats.threadDumpWaiting + stats.threadDumpTimedWaiting + stats.threadDumpBlocked;

    return stats;
  });

  private readonly modalService = inject(NgbModal);

  open(): void {
    const modalRef = this.modalService.open(MetricsModalThreads);
    modalRef.componentInstance.threads = this.threads();
  }
}
