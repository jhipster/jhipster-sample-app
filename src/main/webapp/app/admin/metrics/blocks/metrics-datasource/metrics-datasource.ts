import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { Databases } from 'app/admin/metrics/metrics.model';
import { filterNaN } from 'app/core/util';
import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-metrics-datasource',
  templateUrl: './metrics-datasource.html',
  imports: [DecimalPipe, TranslateDirective],
})
export class MetricsDatasource {
  /**
   * Object containing all datasource related metrics
   */
  readonly datasourceMetrics = input<Databases>();

  /**
   * Boolean field saying if the metrics are in the process of being updated
   */
  readonly updating = input<boolean>();

  filterNaN = filterNaN;
}
