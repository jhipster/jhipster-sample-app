import { DecimalPipe, KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { CacheMetrics } from 'app/admin/metrics/metrics.model';
import { filterNaN } from 'app/core/util';
import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-metrics-cache',
  templateUrl: './metrics-cache.html',
  imports: [KeyValuePipe, DecimalPipe, TranslateDirective],
})
export class MetricsCache {
  /**
   * Object containing all cache related metrics
   */
  readonly cacheMetrics = input<Record<string, CacheMetrics>>();

  /**
   * Boolean field saying if the metrics are in the process of being updated
   */
  readonly updating = input<boolean>();

  filterNaN = filterNaN;
}
