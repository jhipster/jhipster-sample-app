import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';

import { TranslateDirective } from 'app/shared/language';

import { JvmMemory } from './blocks/jvm-memory/jvm-memory';
import { JvmThreads } from './blocks/jvm-threads/jvm-threads';
import { MetricsCache } from './blocks/metrics-cache/metrics-cache';
import { MetricsDatasource } from './blocks/metrics-datasource/metrics-datasource';
import { MetricsEndpointsRequests } from './blocks/metrics-endpoints-requests/metrics-endpoints-requests';
import { MetricsGarbageCollector } from './blocks/metrics-garbagecollector/metrics-garbagecollector';
import { MetricsRequest } from './blocks/metrics-request/metrics-request';
import { MetricsSystem } from './blocks/metrics-system/metrics-system';
import { MetricsModel, Thread } from './metrics.model';
import { MetricsService } from './metrics.service';

@Component({
  selector: 'jhi-metrics',
  templateUrl: './metrics.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateDirective,
    TranslateModule,
    FontAwesomeModule,
    JvmMemory,
    JvmThreads,
    MetricsCache,
    MetricsDatasource,
    MetricsEndpointsRequests,
    MetricsGarbageCollector,
    MetricsRequest,
    MetricsSystem,
  ],
})
export default class Metrics implements OnInit {
  readonly metrics = signal<MetricsModel | undefined>(undefined);
  readonly threads = signal<Thread[] | undefined>(undefined);
  readonly updatingMetrics = signal(true);

  private readonly metricsService = inject(MetricsService);

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.updatingMetrics.set(true);
    combineLatest([this.metricsService.getMetrics(), this.metricsService.threadDump()]).subscribe(([metrics, threadDump]) => {
      this.metrics.set(metrics);
      this.threads.set(threadDump.threads);
      this.updatingMetrics.set(false);
    });
  }

  metricsKeyExistsAndObjectNotEmpty(key: keyof MetricsModel): boolean {
    return Boolean(this.metrics()?.[key] && JSON.stringify(this.metrics()?.[key]) !== '{}');
  }
}
