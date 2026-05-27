import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { ElementRef, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import PasswordResetInit from './password-reset-init';
import { PasswordResetInitService } from './password-reset-init.service';

describe('PasswordResetInit', () => {
  let fixture: ComponentFixture<PasswordResetInit>;
  let comp: PasswordResetInit;
  let service: PasswordResetInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    });
    fixture = TestBed.createComponent(PasswordResetInit);
    comp = fixture.componentInstance;
    service = TestBed.inject(PasswordResetInitService);
  });

  it('sets focus after the view has been initialized', () => {
    const node = {
      focus: vitest.fn(),
    };
    comp.email = signal(new ElementRef(node));

    comp.ngAfterViewInit();

    expect(node.focus).toHaveBeenCalled();
  });

  it('notifies of success upon successful requestReset', () => {
    vitest.spyOn(service, 'save').mockReturnValue(of({}));
    comp.resetRequestForm.patchValue({
      email: 'user@domain.com',
    });

    comp.requestReset();

    expect(service.save).toHaveBeenCalledWith('user@domain.com');
    expect(comp.success()).toBe(true);
  });

  it('no notification of success upon error response', () => {
    const err = { status: 503, data: 'something else' };
    vitest.spyOn(service, 'save').mockReturnValue(throwError(() => err));
    comp.resetRequestForm.patchValue({
      email: 'user@domain.com',
    });
    comp.requestReset();

    expect(service.save).toHaveBeenCalledWith('user@domain.com');
    expect(comp.success()).toBe(false);
  });
});
