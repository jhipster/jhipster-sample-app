import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/shared/jhipster/error.constants';

import Register from './register';
import { RegisterService } from './register.service';

describe('Register', () => {
  let fixture: ComponentFixture<Register>;
  let comp: Register;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Register);
    comp = fixture.componentInstance;
  });

  it('should ensure the two passwords entered match', () => {
    comp.registerForm.patchValue({
      password: 'password',
      confirmPassword: 'non-matching',
    });

    comp.register();

    expect(comp.doNotMatch()).toBe(true);
  });

  it('should update success to true after creating an account', inject(
    [RegisterService, TranslateService],
    (service: RegisterService, mockTranslateService: TranslateService) => {
      vitest.spyOn(service, 'save').mockReturnValue(of({}));
      vitest.spyOn(mockTranslateService, 'getCurrentLang').mockReturnValue('en');
      comp.registerForm.patchValue({
        password: 'password',
        confirmPassword: 'password',
      });

      comp.register();

      expect(service.save).toHaveBeenCalledWith({
        email: '',
        password: 'password',
        login: '',
        langKey: 'en',
      });
      expect(comp.success()).toBe(true);
      expect(comp.errorUserExists()).toBe(false);
      expect(comp.errorEmailExists()).toBe(false);
      expect(comp.error()).toBe(false);
    },
  ));

  it('should notify of user existence upon 400/login already in use', inject([RegisterService], (service: RegisterService) => {
    const err = { status: 400, error: { type: LOGIN_ALREADY_USED_TYPE } };
    vitest.spyOn(service, 'save').mockReturnValue(throwError(() => err));
    comp.registerForm.patchValue({
      password: 'password',
      confirmPassword: 'password',
    });

    comp.register();

    expect(comp.errorUserExists()).toBe(true);
    expect(comp.errorEmailExists()).toBe(false);
    expect(comp.error()).toBe(false);
  }));

  it('should notify of email existence upon 400/email address already in use', inject([RegisterService], (service: RegisterService) => {
    const err = { status: 400, error: { type: EMAIL_ALREADY_USED_TYPE } };
    vitest.spyOn(service, 'save').mockReturnValue(throwError(() => err));
    comp.registerForm.patchValue({
      password: 'password',
      confirmPassword: 'password',
    });

    comp.register();

    expect(comp.errorEmailExists()).toBe(true);
    expect(comp.errorUserExists()).toBe(false);
    expect(comp.error()).toBe(false);
  }));

  it('should notify of generic error', inject([RegisterService], (service: RegisterService) => {
    const err = { status: 503 };
    vitest.spyOn(service, 'save').mockReturnValue(throwError(() => err));
    comp.registerForm.patchValue({
      password: 'password',
      confirmPassword: 'password',
    });

    comp.register();

    expect(comp.errorUserExists()).toBe(false);
    expect(comp.errorEmailExists()).toBe(false);
    expect(comp.error()).toBe(true);
  }));
});
