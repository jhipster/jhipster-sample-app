import { inject, TestBed } from '@angular/core/testing';

import { DataUtils } from './data-util.service';

describe('Data Utils Service Test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataUtils],
    });
  });

  it('should return the bytesize of the text', inject([DataUtils], (service: DataUtils) => {
    expect(service.byteSize('Hello Jhipster')).toBe(`10.5 bytes`);
  }));
});
