import { SpyObject } from './spyobject';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Spy = jasmine.Spy;

export class MockActiveModal extends SpyObject {
  dismissSpy: Spy;
  closeSpy: Spy;

  constructor() {
    super(NgbActiveModal);
    this.dismissSpy = this.spy('dismiss').andReturn(this);
    this.closeSpy = this.spy('close').andReturn(this);
  }
}
