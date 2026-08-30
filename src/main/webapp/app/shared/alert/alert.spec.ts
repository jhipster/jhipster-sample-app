import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WritableSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertModel, AlertService } from 'app/core/util';

import { Alert } from './alert';

describe('Alert Component', () => {
  let comp: Alert;
  let fixture: ComponentFixture<Alert>;
  let mockAlertService: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AlertService,
          useValue: {
            alerts: signal([]),
            clear: vi.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Alert);
    comp = fixture.componentInstance;
    mockAlertService = TestBed.inject(AlertService);
  });

  it('should render alerts added after init', () => {
    // GIVEN
    fixture.detectChanges();

    // WHEN
    const alerts = mockAlertService.alerts as WritableSignal<AlertModel[]>;
    alerts.set([{ id: 0, type: 'success', message: 'Hello' }]);
    fixture.detectChanges();

    // THEN
    expect(fixture.nativeElement.querySelectorAll('ngb-alert')).toHaveLength(1);
  });

  it('should call alertService.clear on destroy', () => {
    // WHEN
    comp.ngOnDestroy();

    // THEN
    expect(mockAlertService.clear).toHaveBeenCalled();
  });
});
