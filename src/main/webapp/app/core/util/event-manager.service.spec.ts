import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { EventManager, EventWithContent } from './event-manager.service';

describe('Event Manager tests', () => {
  describe('EventWithContent', () => {
    it('should create correctly EventWithContent', () => {
      // WHEN
      const eventWithContent = new EventWithContent('name', 'content');

      // THEN
      expect(eventWithContent).toEqual({ name: 'name', content: 'content' });
    });
  });

  describe('EventManager', () => {
    let receivedEvent: EventWithContent<unknown> | null;
    let eventManager: EventManager;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [EventManager],
      });
      eventManager = TestBed.inject(EventManager);
      receivedEvent = null;
    });

    it('should not fail when nosubscriber and broadcasting', () => {
      expect(eventManager.observer).toBeUndefined();
      eventManager.broadcast({ name: 'modifier', content: 'modified something' });
    });

    it('should create an observable and callback when broadcasted EventWithContent', () => {
      // GIVEN
      eventManager.subscribe('modifier', (event: EventWithContent<unknown>) => (receivedEvent = event));

      // WHEN
      eventManager.broadcast({ name: 'unrelatedModifier', content: 'unrelated modification' });
      // THEN
      expect(receivedEvent).toBeNull();

      // WHEN
      eventManager.broadcast({ name: 'modifier', content: 'modified something' });
      // THEN
      expect(receivedEvent).toEqual({ name: 'modifier', content: 'modified something' });
    });

    it('should subscribe to multiple events', () => {
      // GIVEN
      eventManager.subscribe(['modifier', 'modifier2'], (event: EventWithContent<unknown>) => (receivedEvent = event));

      // WHEN
      eventManager.broadcast({ name: 'unrelatedModifier', content: 'unrelated modification' });
      // THEN
      expect(receivedEvent).toBeNull();

      // WHEN
      eventManager.broadcast({ name: 'modifier', content: 'modified something' });
      // THEN
      expect(receivedEvent).toEqual({ name: 'modifier', content: 'modified something' });

      // WHEN
      eventManager.broadcast({ name: 'modifier2', content: 'modified something 2' });
      // THEN
      expect(receivedEvent).toEqual({ name: 'modifier2', content: 'modified something 2' });
    });
  });
});
