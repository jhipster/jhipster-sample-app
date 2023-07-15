import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import SharedModule from 'app/shared/shared.module';
import { CacheMetrics } from 'app/admin/metrics/metrics.model';
import { filterNaN } from 'app/core/util/operators';

@Component({
  standalone: true,
  selector: 'jhi-metrics-cache',
  templateUrl: './metrics-cache.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule],
})
export class MetricsCacheComponent {
  /**
   * object containing all cache related metrics
   */
  @Input() cacheMetrics?: { [key: string]: CacheMetrics };

  /**
   * boolean field saying if the metrics are in the process of being updated
   */
  @Input() updating?: boolean;

  filterNaN = (input: number): number => filterNaN(input);
}
