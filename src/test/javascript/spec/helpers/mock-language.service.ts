import Spy = jasmine.Spy;
import { JhiLanguageService } from 'ng-jhipster';

import { SpyObject } from './spyobject';

export class MockLanguageService extends SpyObject {
  getCurrentLanguageSpy: Spy;

  constructor() {
    super(JhiLanguageService);

    this.getCurrentLanguageSpy = this.spy('getCurrentLanguage').andReturn('en');
  }
}
