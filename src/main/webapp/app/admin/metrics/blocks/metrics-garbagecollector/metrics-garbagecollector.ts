import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';
import { TranslateModule } from '@ngx-translate/core';

import { GarbageCollector } from 'app/admin/metrics/metrics.model';
import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-metrics-garbagecollector',
  templateUrl: './metrics-garbagecollector.html',
  imports: [NgbProgressbar, DecimalPipe, TranslateDirective, TranslateModule],
})
export class MetricsGarbageCollector {
  /**
   * Object containing garbage collector related metrics
   */
  readonly garbageCollectorMetrics = input<GarbageCollector>();

  /**
   * Boolean field saying if the metrics are in the process of being updated
   */
  readonly updating = input<boolean>();
}
