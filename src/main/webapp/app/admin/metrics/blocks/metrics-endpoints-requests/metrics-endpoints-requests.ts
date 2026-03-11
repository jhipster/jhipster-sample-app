import { DecimalPipe, KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { Services } from 'app/admin/metrics/metrics.model';

@Component({
  selector: 'jhi-metrics-endpoints-requests',
  templateUrl: './metrics-endpoints-requests.html',
  imports: [KeyValuePipe, DecimalPipe],
})
export class MetricsEndpointsRequests {
  /**
   * Object containing service related metrics
   */
  readonly endpointsRequestsMetrics = input<Services>();

  /**
   * Boolean field saying if the metrics are in the process of being updated
   */
  readonly updating = input<boolean>();
}
