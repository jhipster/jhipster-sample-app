import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';

import { Thread, ThreadState } from 'app/admin/metrics/metrics.model';
import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-thread-modal',
  templateUrl: './metrics-modal-threads.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, TranslateDirective, TranslateModule],
})
export class MetricsModalThreads implements OnInit {
  ThreadState = ThreadState;
  threadStateFilter?: ThreadState;
  threads?: Thread[];
  threadDumpAll = 0;
  threadDumpBlocked = 0;
  threadDumpRunnable = 0;
  threadDumpTimedWaiting = 0;
  threadDumpWaiting = 0;

  private readonly activeModal = inject(NgbActiveModal);

  ngOnInit(): void {
    if (this.threads) {
      for (const thread of this.threads) {
        if (thread.threadState === ThreadState.Runnable) {
          this.threadDumpRunnable += 1;
        } else if (thread.threadState === ThreadState.Waiting) {
          this.threadDumpWaiting += 1;
        } else if (thread.threadState === ThreadState.TimedWaiting) {
          this.threadDumpTimedWaiting += 1;
        } else if (thread.threadState === ThreadState.Blocked) {
          this.threadDumpBlocked += 1;
        }
      }
    }

    this.threadDumpAll = this.threadDumpRunnable + this.threadDumpWaiting + this.threadDumpTimedWaiting + this.threadDumpBlocked;
  }

  getBadgeClass(threadState: ThreadState): string {
    if (threadState === ThreadState.Runnable) {
      return 'bg-success';
    } else if (threadState === ThreadState.Waiting) {
      return 'bg-info';
    } else if (threadState === ThreadState.TimedWaiting) {
      return 'bg-warning';
    } else if (threadState === ThreadState.Blocked) {
      return 'bg-danger';
    }
    return '';
  }

  getThreads(): Thread[] {
    return this.threads?.filter(thread => !this.threadStateFilter || thread.threadState === this.threadStateFilter) ?? [];
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
