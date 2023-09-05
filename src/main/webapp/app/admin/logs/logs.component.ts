import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { SortDirective, SortByDirective } from 'app/shared/sort';
import { Log, LoggersResponse, Level } from './log.model';
import { LogsService } from './logs.service';

@Component({
  standalone: true,
  selector: 'jhi-logs',
  templateUrl: './logs.component.html',
  imports: [SharedModule, FormsModule, SortDirective, SortByDirective],
})
export default class LogsComponent implements OnInit {
  loggers?: Log[];
  filteredAndOrderedLoggers?: Log[];
  isLoading = false;
  filter = '';
  orderProp: keyof Log = 'name';
  ascending = true;

  constructor(private logsService: LogsService) {}

  ngOnInit(): void {
    this.findAndExtractLoggers();
  }

  changeLevel(name: string, level: Level): void {
    this.logsService.changeLevel(name, level).subscribe(() => this.findAndExtractLoggers());
  }

  filterAndSort(): void {
    this.filteredAndOrderedLoggers = this.loggers!.filter(
      logger => !this.filter || logger.name.toLowerCase().includes(this.filter.toLowerCase()),
    ).sort((a, b) => {
      if (a[this.orderProp] < b[this.orderProp]) {
        return this.ascending ? -1 : 1;
      } else if (a[this.orderProp] > b[this.orderProp]) {
        return this.ascending ? 1 : -1;
      } else if (this.orderProp === 'level') {
        return a.name < b.name ? -1 : 1;
      }
      return 0;
    });
  }

  private findAndExtractLoggers(): void {
    this.isLoading = true;
    this.logsService
      .findAll()
      .pipe(
        finalize(() => {
          this.filterAndSort();
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (response: LoggersResponse) =>
          (this.loggers = Object.entries(response.loggers).map(([key, logger]) => new Log(key, logger.effectiveLevel))),
        error: () => (this.loggers = []),
      });
  }
}
