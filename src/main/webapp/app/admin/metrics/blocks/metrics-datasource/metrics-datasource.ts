import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { Databases } from 'app/admin/metrics/metrics.model';
import { filterNaN } from 'app/core/util/operators';
import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-metrics-datasource',
  templateUrl: './metrics-datasource.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, TranslateDirective, TranslateModule],
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
