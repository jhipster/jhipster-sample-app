import { DecimalPipe, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { CacheMetrics } from 'app/admin/metrics/metrics.model';
import { filterNaN } from 'app/core/util/operators';
import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-metrics-cache',
  templateUrl: './metrics-cache.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KeyValuePipe, DecimalPipe, TranslateDirective, TranslateModule],
})
export class MetricsCache {
  /**
   * Object containing all cache related metrics
   */
  cacheMetrics = input<Record<string, CacheMetrics>>();

  /**
   * Boolean field saying if the metrics are in the process of being updated
   */
  readonly updating = input<boolean>();

  filterNaN = filterNaN;
}
