import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import Metrics from './metrics';
import { MetricsModel, Thread, ThreadDump } from './metrics.model';
import { MetricsService } from './metrics.service';

describe('Metrics', () => {
  let comp: Metrics;
  let fixture: ComponentFixture<Metrics>;
  let service: MetricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Metrics);
    comp = fixture.componentInstance;
    service = TestBed.inject(MetricsService);
  });

  describe('refresh', () => {
    it('should call refresh on init', () => {
      // GIVEN
      const metrics = {
        garbageCollector: {
          'PS Scavenge': {
            collectionCount: 0,
            collectionTime: 0,
          },
          'PS MarkSweep': {
            collectionCount: 0,
            collectionTime: 0,
          },
        },
      } as unknown as MetricsModel;
      const threadDump = { threads: [{ threadName: 'thread 1' } as Thread] } as ThreadDump;

      vitest.spyOn(service, 'getMetrics').mockReturnValue(of(metrics));
      vitest.spyOn(service, 'threadDump').mockReturnValue(of(threadDump));

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.getMetrics).toHaveBeenCalled();
      expect(comp.metrics()).toEqual(metrics);
      expect(comp.threads()).toEqual(threadDump.threads);
      expect(comp.updatingMetrics()).toBeFalsy();
    });
  });

  describe('metricsKeyExistsAndObjectNotEmpty', () => {
    it('should check that metrics key exists and is not empty', () => {
      // GIVEN
      comp.metrics.set({
        garbageCollector: {
          'PS Scavenge': {
            collectionCount: 0,
            collectionTime: 0,
          },
          'PS MarkSweep': {
            collectionCount: 0,
            collectionTime: 0,
          },
        },
      } as unknown as MetricsModel);

      // WHEN
      const garbageCollectorKeyExistsAndNotEmpty = comp.metricsKeyExistsAndObjectNotEmpty('garbageCollector');

      // THEN
      expect(garbageCollectorKeyExistsAndNotEmpty).toBeTruthy();
    });

    it('should check that metrics key is empty', () => {
      // GIVEN
      comp.metrics.set({
        garbageCollector: {},
      } as MetricsModel);

      // WHEN
      const garbageCollectorKeyEmpty = comp.metricsKeyExistsAndObjectNotEmpty('garbageCollector');

      // THEN
      expect(garbageCollectorKeyEmpty).toBeFalsy();
    });
  });
});
