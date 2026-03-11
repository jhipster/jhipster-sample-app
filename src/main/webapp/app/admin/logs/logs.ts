import { SlicePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';

import { TranslateDirective } from 'app/shared/language';
import { SortByDirective, SortDirective, SortService, sortStateSignal } from 'app/shared/sort';

import { Level, Log, LoggersResponse } from './log.model';
import { LogsService } from './logs.service';

@Component({
  selector: 'jhi-logs',
  templateUrl: './logs.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, FormsModule, SortDirective, SortByDirective, SlicePipe],
})
export default class Logs implements OnInit {
  readonly loggers = signal<Log[] | undefined>(undefined);
  readonly isLoading = signal(false);
  readonly filter = signal('');
  sortState = sortStateSignal({ predicate: 'name', order: 'asc' });
  readonly filteredAndOrderedLoggers = computed<Log[] | undefined>(() => {
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

  private readonly logsService = inject(LogsService);
  private readonly sortService = inject(SortService);

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
