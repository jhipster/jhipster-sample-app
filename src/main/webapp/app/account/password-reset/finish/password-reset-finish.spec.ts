import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { ElementRef, signal } from '@angular/core';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import PasswordResetFinish from './password-reset-finish';
import { PasswordResetFinishService } from './password-reset-finish.service';

describe('PasswordResetFinish', () => {
  let fixture: ComponentFixture<PasswordResetFinish>;
  let comp: PasswordResetFinish;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ key: 'XYZPDQ' }) },
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetFinish);
    comp = fixture.componentInstance;
    comp.ngOnInit();
  });

  it('should define its initial state', () => {
    expect(comp.initialized()).toBe(true);
    expect(comp.key()).toEqual('XYZPDQ');
  });

  it('sets focus after the view has been initialized', () => {
    const node = {
      focus: vitest.fn(),
    };
    comp.newPassword = signal(new ElementRef(node));

    comp.ngAfterViewInit();

    expect(node.focus).toHaveBeenCalled();
  });

  it('should ensure the two passwords entered match', () => {
    comp.passwordForm.patchValue({
      newPassword: 'password',
      confirmPassword: 'non-matching',
    });

    comp.finishReset();

    expect(comp.doNotMatch()).toBe(true);
  });

  it('should update success to true after resetting password', inject(
    [PasswordResetFinishService],
    (service: PasswordResetFinishService) => {
      vitest.spyOn(service, 'save').mockReturnValue(of({}));
      comp.passwordForm.patchValue({
        newPassword: 'password',
        confirmPassword: 'password',
      });

      comp.finishReset();

      expect(service.save).toHaveBeenCalledWith('XYZPDQ', 'password');
      expect(comp.success()).toBe(true);
    },
  ));

  it('should notify of generic error', inject([PasswordResetFinishService], (service: PasswordResetFinishService) => {
    vitest.spyOn(service, 'save').mockReturnValue(throwError(Error));
    comp.passwordForm.patchValue({
      newPassword: 'password',
      confirmPassword: 'password',
    });

    comp.finishReset();

    expect(service.save).toHaveBeenCalledWith('XYZPDQ', 'password');
    expect(comp.success()).toBe(false);
    expect(comp.error()).toBe(true);
  }));
});
