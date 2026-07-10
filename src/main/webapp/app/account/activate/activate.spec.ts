import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { TestBed, inject } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import Activate from './activate';
import { ActivateService } from './activate.service';

describe('Activate', () => {
  let comp: Activate;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ key: 'ABC123' }) },
        },
      ],
    });
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(Activate);
    comp = fixture.componentInstance;
  });

  it('calls activate.get with the key from params', inject([ActivateService], (service: ActivateService) => {
    vitest.spyOn(service, 'get').mockReturnValue(of());

    comp.ngOnInit();

    expect(service.get).toHaveBeenCalledWith('ABC123');
  }));

  it('should set success to true upon successful activation', inject([ActivateService], (service: ActivateService) => {
    vitest.spyOn(service, 'get').mockReturnValue(of({}));

    comp.ngOnInit();

    expect(comp.error()).toBe(false);
    expect(comp.success()).toBe(true);
  }));

  it('should set error to true upon activation failure', inject([ActivateService], (service: ActivateService) => {
    vitest.spyOn(service, 'get').mockReturnValue(throwError(Error));

    comp.ngOnInit();

    expect(comp.error()).toBe(true);
    expect(comp.success()).toBe(false);
  }));
});
