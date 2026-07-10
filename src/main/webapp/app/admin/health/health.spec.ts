import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideTranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import Health from './health';
import { HealthModel } from './health.model';
import { HealthService } from './health.service';

describe('Health', () => {
  let comp: Health;
  let fixture: ComponentFixture<Health>;
  let service: HealthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService()],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Health);
    comp = fixture.componentInstance;
    service = TestBed.inject(HealthService);
  });

  describe('getBadgeClass', () => {
    it('should get badge class', () => {
      const upBadgeClass = comp.getBadgeClass('UP');
      const downBadgeClass = comp.getBadgeClass('DOWN');
      expect(upBadgeClass).toEqual('bg-success');
      expect(downBadgeClass).toEqual('bg-danger');
    });
  });

  describe('refresh', () => {
    it('should call refresh on init', () => {
      // GIVEN
      const health: HealthModel = { status: 'UP', components: { mail: { status: 'UP', details: { mailDetail: 'mail' } } } };
      vitest.spyOn(service, 'checkHealth').mockReturnValue(of(health));

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.checkHealth).toHaveBeenCalled();
      expect(comp.health()).toEqual(health);
    });

    it('should handle a 503 on refreshing health data', () => {
      // GIVEN
      const health: HealthModel = { status: 'DOWN', components: { mail: { status: 'DOWN' } } };
      vitest.spyOn(service, 'checkHealth').mockReturnValue(throwError(() => new HttpErrorResponse({ status: 503, error: health })));

      // WHEN
      comp.refresh();

      // THEN
      expect(service.checkHealth).toHaveBeenCalled();
      expect(comp.health()).toEqual(health);
    });
  });
});
