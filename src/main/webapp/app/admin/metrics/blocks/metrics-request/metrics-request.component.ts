import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { HttpServerRequests } from 'app/admin/metrics/metrics.model';

@Component({
  selector: 'jhi-metrics-request',
  templateUrl: './metrics-request.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsRequestComponent {
  /**
   * object containing http request related metrics
   */
  @Input() requestMetrics?: HttpServerRequests;

  /**
   * boolean field saying if the metrics are in the process of being updated
   */
  @Input() updating?: boolean;

  filterNaN(input: number): number {
    return isNaN(input) ? 0 : input;
  }
}
