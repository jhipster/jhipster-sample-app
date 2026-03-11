import { DecimalPipe, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';
import { TranslateModule } from '@ngx-translate/core';

import { HttpServerRequests } from 'app/admin/metrics/metrics.model';
import { filterNaN } from 'app/core/util/operators';
import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-metrics-request',
  templateUrl: './metrics-request.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbProgressbar, KeyValuePipe, DecimalPipe, TranslateDirective, TranslateModule],
})
export class MetricsRequest {
  /**
   * Object containing http request related metrics
   */
  readonly requestMetrics = input<HttpServerRequests>();

  /**
   * Boolean field saying if the metrics are in the process of being updated
   */
  readonly updating = input<boolean>();

  filterNaN = filterNaN;
}
