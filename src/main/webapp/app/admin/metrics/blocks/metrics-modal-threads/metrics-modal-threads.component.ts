import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Thread, ThreadState } from 'app/admin/metrics/metrics.model';

@Component({
  selector: 'jhi-thread-modal',
  templateUrl: './metrics-modal-threads.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsModalThreadsComponent implements OnInit {
  ThreadState = ThreadState;
  threadStateFilter?: ThreadState;
  threads?: Thread[];
  threadDumpAll = 0;
  threadDumpBlocked = 0;
  threadDumpRunnable = 0;
  threadDumpTimedWaiting = 0;
  threadDumpWaiting = 0;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.threads?.forEach(thread => {
      if (thread.threadState === 'RUNNABLE') {
        this.threadDumpRunnable += 1;
      } else if (thread.threadState === 'WAITING') {
        this.threadDumpWaiting += 1;
      } else if (thread.threadState === 'TIMED_WAITING') {
        this.threadDumpTimedWaiting += 1;
      } else if (thread.threadState === 'BLOCKED') {
        this.threadDumpBlocked += 1;
      }
    });

    this.threadDumpAll = this.threadDumpRunnable + this.threadDumpWaiting + this.threadDumpTimedWaiting + this.threadDumpBlocked;
  }

  getBadgeClass(threadState: ThreadState): string {
    if (threadState === 'RUNNABLE') {
      return 'badge-success';
    } else if (threadState === 'WAITING') {
      return 'badge-info';
    } else if (threadState === 'TIMED_WAITING') {
      return 'badge-warning';
    } else if (threadState === 'BLOCKED') {
      return 'badge-danger';
    }
    return '';
  }

  getThreads(): Thread[] {
    return this.threads?.filter(thread => !this.threadStateFilter || thread.threadState === this.threadStateFilter) ?? [];
  }
}
