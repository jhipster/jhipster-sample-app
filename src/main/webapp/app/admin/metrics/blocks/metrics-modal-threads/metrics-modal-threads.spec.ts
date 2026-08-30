import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { provideTranslateService } from '@ngx-translate/core';

import { Thread, ThreadState } from '../../metrics.model';

import { MetricsModalThreads } from './metrics-modal-threads';

const createThread = (threadState: ThreadState, threadId: number): Thread => ({ threadId, threadState }) as Thread;

describe('MetricsModalThreads', () => {
  let comp: MetricsModalThreads;
  let fixture: ComponentFixture<MetricsModalThreads>;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService(), NgbActiveModal],
    });

    fixture = TestBed.createComponent(MetricsModalThreads);
    comp = fixture.componentInstance;
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('ngOnInit', () => {
    it('should count threads on init', () => {
      // GIVEN
      comp.threads = [
        createThread(ThreadState.Blocked, 1),
        createThread(ThreadState.Runnable, 2),
        createThread(ThreadState.TimedWaiting, 3),
        createThread(ThreadState.Waiting, 4),
      ];

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.threadDumpRunnable).toEqual(1);
      expect(comp.threadDumpWaiting).toEqual(1);
      expect(comp.threadDumpTimedWaiting).toEqual(1);
      expect(comp.threadDumpBlocked).toEqual(1);
      expect(comp.threadDumpAll).toEqual(4);
    });
  });

  describe('getBadgeClass', () => {
    it('should return a success badge class for runnable thread state', () => {
      // GIVEN
      const threadState = ThreadState.Runnable;

      // WHEN
      const badgeClass = comp.getBadgeClass(threadState);

      // THEN
      expect(badgeClass).toEqual('bg-success');
    });

    it('should return an info badge class for waiting thread state', () => {
      // GIVEN
      const threadState = ThreadState.Waiting;

      // WHEN
      const badgeClass = comp.getBadgeClass(threadState);

      // THEN
      expect(badgeClass).toEqual('bg-info');
    });

    it('should return a warning badge class for timed waiting thread state', () => {
      // GIVEN
      const threadState = ThreadState.TimedWaiting;

      // WHEN
      const badgeClass = comp.getBadgeClass(threadState);

      // THEN
      expect(badgeClass).toEqual('bg-warning');
    });

    it('should return a danger badge class for blocked thread state', () => {
      // GIVEN
      const threadState = ThreadState.Blocked;

      // WHEN
      const badgeClass = comp.getBadgeClass(threadState);

      // THEN
      expect(badgeClass).toEqual('bg-danger');
    });

    it('should return an empty string for others threads', () => {
      // GIVEN
      const threadState = ThreadState.New;

      // WHEN
      const badgeClass = comp.getBadgeClass(threadState);

      // THEN
      expect(badgeClass).toEqual('');
    });
  });

  describe('getThreads', () => {
    // GIVEN
    const blockedThread = createThread(ThreadState.Blocked, 1);
    const runnableThread = createThread(ThreadState.Runnable, 2);

    it('should return blocked threads', () => {
      // GIVEN
      comp.threads = [blockedThread, runnableThread];
      comp.threadStateFilter = ThreadState.Blocked;

      // WHEN
      const threadsFiltered = comp.getThreads();

      // THEN
      expect(threadsFiltered).toEqual([blockedThread]);
    });

    it('should return an empty array of threads', () => {
      // GIVEN
      comp.threads = [];
      comp.threadStateFilter = ThreadState.Blocked;

      // WHEN
      const threadsFiltered = comp.getThreads();

      // THEN
      expect(threadsFiltered).toEqual([]);
    });

    it('should return all threads if there is no filter', () => {
      // GIVEN
      comp.threads = [blockedThread, runnableThread];
      comp.threadStateFilter = undefined;

      // WHEN
      const threadsFiltered = comp.getThreads();

      // THEN
      expect(threadsFiltered).toEqual(comp.threads);
    });

    it('should return an empty array if there are no threads to filter', () => {
      // GIVEN
      comp.threads = undefined;
      comp.threadStateFilter = ThreadState.Blocked;

      // WHEN
      const threadsFiltered = comp.getThreads();

      // THEN
      expect(threadsFiltered).toEqual([]);
    });
  });

  describe('dismiss', () => {
    it('should call dismiss function for modal on dismiss', () => {
      // GIVEN
      vi.spyOn(mockActiveModal, 'dismiss');

      // WHEN
      comp.dismiss();

      // THEN
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
