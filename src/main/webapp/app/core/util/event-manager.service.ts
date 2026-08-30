import { Service } from '@angular/core';

import { Observable, Observer, Subscription, filter, share } from 'rxjs';

export class EventWithContent<T> {
  constructor(
    public name: string,
    public content: T,
  ) {}
}

/**
 * A utility class to manage RX events
 */
@Service()
export class EventManager {
  observable: Observable<EventWithContent<unknown>>;
  observer?: Observer<EventWithContent<unknown>>;

  constructor() {
    this.observable = new Observable((observer: Observer<EventWithContent<unknown>>) => {
      this.observer = observer;
    }).pipe(share());
  }

  /**
   * Method to broadcast the event to observer
   */
  broadcast(event: EventWithContent<unknown>): void {
    if (this.observer) {
      this.observer.next(event);
    }
  }

  /**
   * Method to subscribe to an event with callback
   * @param eventNames  Single event name or array of event names to what subscribe
   * @param callback    Callback to run when the event occurs
   */
  subscribe(eventNames: string | string[], callback: (event: EventWithContent<unknown>) => void): Subscription {
    if (typeof eventNames === 'string') {
      eventNames = [eventNames];
    }
    return this.observable.pipe(filter((event: EventWithContent<unknown>) => eventNames.includes(event.name))).subscribe(callback);
  }

  /**
   * Method to unsubscribe the subscription
   */
  destroy(subscriber: Subscription): void {
    subscriber.unsubscribe();
  }
}
