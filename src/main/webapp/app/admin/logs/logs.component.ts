import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { SortByDirective, SortDirective, SortService, sortStateSignal } from 'app/shared/sort';
import { Level, Log, LoggersResponse } from './log.model';
import { LogsService } from './logs.service';

@Component({
  standalone: true,
  selector: 'jhi-logs',
  templateUrl: './logs.component.html',
  imports: [SharedModule, FormsModule, SortDirective, SortByDirective],
})
export default class LogsComponent implements OnInit {
  loggers = signal<Log[] | undefined>(undefined);
  isLoading = signal(false);
  filter = signal('');
  sortState = sortStateSignal({ predicate: 'name', order: 'asc' });
  filteredAndOrderedLoggers = computed<Log[] | undefined>(() => {
    let data = this.loggers() ?? [];
    const filter = this.filter();
    if (filter) {
      data = data.filter(logger => logger.name.toLowerCase().includes(filter.toLowerCase()));
    }

    const { order, predicate } = this.sortState();
    if (order && predicate) {
      data = data.sort(this.sortService.startSort({ order, predicate }, { predicate: 'name', order: 'asc' }));
    }
    return data;
  });

  private logsService = inject(LogsService);
  private sortService = inject(SortService);

  ngOnInit(): void {
    this.findAndExtractLoggers();
  }

  changeLevel(name: string, level: Level): void {
    this.logsService.changeLevel(name, level).subscribe(() => this.findAndExtractLoggers());
  }

  private findAndExtractLoggers(): void {
    this.isLoading.set(true);
    this.logsService
      .findAll()
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (response: LoggersResponse) =>
          this.loggers.set(Object.entries(response.loggers).map(([key, logger]) => new Log(key, logger.effectiveLevel))),
        error: () => this.loggers.set([]),
      });
  }
}
