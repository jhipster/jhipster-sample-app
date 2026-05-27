import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { MissingTranslationHandler, TranslateModule, TranslateService } from '@ngx-translate/core';

import { missingTranslationHandler } from '../../config/translation.config';

import { AlertModel, AlertService } from './alert.service';

describe('Alert Service Test', () => {
  let extAlerts: AlertModel[];
  let service: AlertService;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          missingTranslationHandler: {
            provide: MissingTranslationHandler,
            useFactory: missingTranslationHandler,
          },
        }),
      ],
    });
    service = TestBed.inject(AlertService);
    translateService = TestBed.inject(TranslateService);
    translateService.setFallbackLang('en');
    vitest.useFakeTimers();
    extAlerts = [];
  });

  it('should produce a proper alert object and fetch it', () => {
    expect(
      service.addAlert({
        type: 'success',
        message: 'Hello Jhipster',
        timeout: 3000,
        toast: true,
        position: 'top left',
      }),
    ).toEqual(
      expect.objectContaining({
        type: 'success',
        message: 'Hello Jhipster',
        id: 0,
        timeout: 3000,
        toast: true,
        position: 'top left',
      }),
    );

    expect(service.get().length).toBe(1);
    expect(service.get()[0]).toEqual(
      expect.objectContaining({
        type: 'success',
        message: 'Hello Jhipster',
        id: 0,
        timeout: 3000,
        toast: true,
        position: 'top left',
      }),
    );
  });

  it('should produce a proper alert object and add it to external alert objects array', () => {
    expect(
      service.addAlert(
        {
          type: 'success',
          message: 'Hello Jhipster',
          timeout: 3000,
          toast: true,
          position: 'top left',
        },
        extAlerts,
      ),
    ).toEqual(
      expect.objectContaining({
        type: 'success',
        message: 'Hello Jhipster',
        id: 0,
        timeout: 3000,
        toast: true,
        position: 'top left',
      }),
    );

    expect(extAlerts.length).toBe(1);
    expect(extAlerts[0]).toEqual(
      expect.objectContaining({
        type: 'success',
        message: 'Hello Jhipster',
        id: 0,
        timeout: 3000,
        toast: true,
        position: 'top left',
      }),
    );
  });

  it('should produce an alert object with correct id', () => {
    service.addAlert({ type: 'info', message: 'Hello Jhipster info' });
    expect(service.addAlert({ type: 'success', message: 'Hello JHipster success' })).toEqual(
      expect.objectContaining({
        type: 'success',
        message: 'Hello JHipster success',
        id: 1,
      }),
    );

    expect(service.get().length).toBe(2);
    expect(service.get()[1]).toEqual(
      expect.objectContaining({
        type: 'success',
        message: 'Hello JHipster success',
        id: 1,
      }),
    );
  });

  it('should close an alert correctly', () => {
    const alert0 = service.addAlert({ type: 'info', message: 'Hello Jhipster info' });
    const alert1 = service.addAlert({ type: 'info', message: 'Hello Jhipster info 2' });
    const alert2 = service.addAlert({ type: 'success', message: 'Hello JHipster success' });
    expect(alert2).toEqual(
      expect.objectContaining({
        type: 'success',
        message: 'Hello JHipster success',
        id: 2,
      }),
    );

    expect(service.get().length).toBe(3);
    alert1.close?.(service.get());
    expect(service.get().length).toBe(2);
    expect(service.get()[1]).not.toEqual(
      expect.objectContaining({
        type: 'info',
        message: 'Hello Jhipster info 2',
        id: 1,
      }),
    );
    alert2.close?.(service.get());
    expect(service.get().length).toBe(1);
    expect(service.get()[0]).not.toEqual(
      expect.objectContaining({
        type: 'success',
        message: 'Hello JHipster success',
        id: 2,
      }),
    );
    alert0.close?.(service.get());
    expect(service.get().length).toBe(0);
  });

  it('should close an alert on timeout correctly', () => {
    service.addAlert({ type: 'info', message: 'Hello Jhipster info' });

    expect(service.get().length).toBe(1);

    vitest.advanceTimersByTime(6000);

    expect(service.get().length).toBe(0);
  });

  it('should clear alerts', () => {
    service.addAlert({ type: 'info', message: 'Hello Jhipster info' });
    service.addAlert({ type: 'danger', message: 'Hello Jhipster info' });
    service.addAlert({ type: 'success', message: 'Hello Jhipster info' });
    expect(service.get().length).toBe(3);
    service.clear();
    expect(service.get().length).toBe(0);
  });

  it('should produce a scoped alert', () => {
    expect(
      service.addAlert(
        {
          type: 'success',
          message: 'Hello Jhipster',
          timeout: 3000,
          toast: true,
          position: 'top left',
        },
        [],
      ),
    ).toEqual(
      expect.objectContaining({
        type: 'success',
        message: 'Hello Jhipster',
        id: 0,
        timeout: 3000,
        toast: true,
        position: 'top left',
      }),
    );

    expect(service.get().length).toBe(0);
  });

  it('should produce a success message', () => {
    expect(service.addAlert({ type: 'success', message: 'Hello Jhipster' })).toEqual(
      expect.objectContaining({
        type: 'success',
        message: 'Hello Jhipster',
      }),
    );
  });

  it('should produce a success message with custom position', () => {
    expect(service.addAlert({ type: 'success', message: 'Hello Jhipster', position: 'bottom left' })).toEqual(
      expect.objectContaining({
        type: 'success',
        message: 'Hello Jhipster',
        position: 'bottom left',
      }),
    );
  });

  it('should produce an error message', () => {
    expect(service.addAlert({ type: 'danger', message: 'Hello Jhipster' })).toEqual(
      expect.objectContaining({
        type: 'danger',
        message: 'Hello Jhipster',
      }),
    );
  });

  it('should produce a warning message', () => {
    expect(service.addAlert({ type: 'warning', message: 'Hello Jhipster' })).toEqual(
      expect.objectContaining({
        type: 'warning',
        message: 'Hello Jhipster',
      }),
    );
  });

  it('should produce a info message', () => {
    expect(service.addAlert({ type: 'info', message: 'Hello Jhipster' })).toEqual(
      expect.objectContaining({
        type: 'info',
        message: 'Hello Jhipster',
      }),
    );
  });

  it('should produce a info message with translated message if key exists', () => {
    translateService.setTranslation('en', {
      'hello.jhipster': 'Translated message',
    });
    expect(service.addAlert({ type: 'info', message: 'Hello Jhipster', translationKey: 'hello.jhipster' })).toEqual(
      expect.objectContaining({
        type: 'info',
        message: 'Translated message',
      }),
    );
  });

  it('should produce a info message with provided message if key does not exists', () => {
    expect(service.addAlert({ type: 'info', message: 'Hello Jhipster', translationKey: 'hello.jhipster' })).toEqual(
      expect.objectContaining({
        type: 'info',
        message: 'Hello Jhipster',
      }),
    );
  });

  it('should produce a info message with provided key if translation key does not exist in translations and message is not provided', () => {
    expect(service.addAlert({ type: 'info', translationKey: 'hello.jhipster' })).toEqual(
      expect.objectContaining({
        type: 'info',
        message: 'hello.jhipster',
      }),
    );
  });
});
