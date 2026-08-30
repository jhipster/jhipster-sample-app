import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';

import { ProcessMetrics } from 'app/admin/metrics/metrics.model';

const MILLISECONDS_PER_UNIT = {
  year: 31557600000,
  month: 2629746000,
  day: 86400000,
  hour: 3600000,
  minute: 60000,
  second: 1000,
};

@Component({
  selector: 'jhi-metrics-system',
  templateUrl: './metrics-system.html',
  imports: [NgbProgressbar, DecimalPipe, DatePipe],
})
export class MetricsSystem {
  /**
   * Object containing process related metrics
   */
  readonly systemMetrics = input<ProcessMetrics>();

  /**
   * Boolean field saying if the metrics are in the process of being updated
   */
  readonly updating = input<boolean>();

  convertMillisecondsToDuration(ms: number): string {
    const durations: string[] = [];
    for (const [unit, millisecondsPerUnit] of Object.entries(MILLISECONDS_PER_UNIT)) {
      const count = Math.floor(ms / millisecondsPerUnit);
      if (count > 0) {
        durations.push(`${count} ${unit}${count > 1 ? 's' : ''}`);
        ms %= millisecondsPerUnit;
      }
    }
    return durations.join(' ');
  }
}
