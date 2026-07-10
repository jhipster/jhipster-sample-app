import { beforeEach, describe, expect, it } from 'vitest';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideTranslateService } from '@ngx-translate/core';

import { AlertModel, AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { MESSAGE_ERROR_HEADER_NAME, MESSAGE_PARAM_HEADER_NAME } from 'app/shared/jhipster/constants';
import { ProblemWithMessageType } from 'app/shared/jhipster/problem-details';

import { AlertError } from './alert-error';

describe('Alert Error Component', () => {
  let comp: AlertError;
  let fixture: ComponentFixture<AlertError>;
  let eventManager: EventManager;
  let alertService: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService(), EventManager, AlertService],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertError);
    comp = fixture.componentInstance;
    eventManager = TestBed.inject(EventManager);
    alertService = TestBed.inject(AlertService);
    alertService.addAlert = (alert: AlertModel, alerts?: AlertModel[]) => {
      if (alerts) {
        alerts.push(alert);
      }
      return alert;
    };
  });

  describe('Error Handling', () => {
    it('should display an alert on status 0', () => {
      // GIVEN
      eventManager.broadcast({ name: 'jhipsterSampleApplicationApp.httpError', content: { status: 0 } });
      // THEN
      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].translationKey).toBe('error.server.not.reachable');
    });

    it('should display an alert on status 404', () => {
      // GIVEN
      eventManager.broadcast({ name: 'jhipsterSampleApplicationApp.httpError', content: { status: 404 } });
      // THEN
      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].translationKey).toBe('error.url.not.found');
    });

    it('should display an alert on generic error', () => {
      // GIVEN
      eventManager.broadcast({ name: 'jhipsterSampleApplicationApp.httpError', content: { error: { message: 'Error Message' } } });
      eventManager.broadcast({ name: 'jhipsterSampleApplicationApp.httpError', content: { error: 'Second Error Message' } });
      // THEN
      expect(comp.alerts()).toHaveLength(2);
      expect(comp.alerts()[0].translationKey).toBe('Error Message');
      expect(comp.alerts()[1].translationKey).toBe('Second Error Message');
    });

    it('should display an alert on status 400 for generic error', () => {
      // GIVEN
      const response = new HttpErrorResponse({
        url: 'http://localhost:8080/api/foos',
        headers: new HttpHeaders(),
        status: 400,
        statusText: 'Bad Request',
        error: {
          type: ProblemWithMessageType,
          title: 'Bad Request',
          status: 400,
          path: '/api/foos',
          message: 'error.validation',
        },
      });
      eventManager.broadcast({ name: 'jhipsterSampleApplicationApp.httpError', content: response });
      // THEN
      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].translationKey).toBe('error.validation');
    });

    it('should display an alert on status 400 for generic error without message', () => {
      // GIVEN
      const response = new HttpErrorResponse({
        url: 'http://localhost:8080/api/foos',
        headers: new HttpHeaders(),
        status: 400,
        error: 'Bad Request',
      });
      eventManager.broadcast({ name: 'jhipsterSampleApplicationApp.httpError', content: response });
      // THEN
      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].translationKey).toBe('Bad Request');
    });

    it('should display an alert on status 400 for invalid parameters', () => {
      // GIVEN
      const response = new HttpErrorResponse({
        url: 'http://localhost:8080/api/foos',
        headers: new HttpHeaders(),
        status: 400,
        statusText: 'Bad Request',
        error: {
          type: ProblemWithMessageType,
          title: 'Method argument not valid',
          status: 400,
          path: '/api/foos',
          message: 'error.validation',
          fieldErrors: [{ objectName: 'foo', field: 'minField', message: 'Min' }],
        },
      });
      eventManager.broadcast({ name: 'jhipsterSampleApplicationApp.httpError', content: response });
      // THEN
      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].translationKey).toBe('error.Size');
    });

    it('should display an alert on status 400 for error headers', () => {
      // GIVEN
      const response = new HttpErrorResponse({
        url: 'http://localhost:8080/api/foos',
        headers: new HttpHeaders().append(MESSAGE_ERROR_HEADER_NAME, 'header.error').append(MESSAGE_PARAM_HEADER_NAME, 'foo'),
        status: 400,
        statusText: 'Bad Request',
        error: {
          status: 400,
          message: 'error.validation',
        },
      });
      eventManager.broadcast({ name: 'jhipsterSampleApplicationApp.httpError', content: response });
      // THEN
      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].translationKey).toBe('header.error');
    });

    it('should display an alert on status 500 with detail', () => {
      // GIVEN
      const response = new HttpErrorResponse({
        url: 'http://localhost:8080/api/foos',
        headers: new HttpHeaders(),
        status: 500,
        statusText: 'Internal server error',
        error: {
          status: 500,
          message: 'error.http.500',
          detail: 'Detailed error message',
        },
      });
      eventManager.broadcast({ name: 'jhipsterSampleApplicationApp.httpError', content: response });
      // THEN
      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].translationKey).toBe('error.http.500');
    });
  });
});
