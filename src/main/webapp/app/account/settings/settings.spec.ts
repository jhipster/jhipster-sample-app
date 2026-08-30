import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideTranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { Account, AccountService } from 'app/core/auth';

import Settings from './settings';

describe('Settings', () => {
  let comp: Settings;
  let fixture: ComponentFixture<Settings>;
  let mockAccountService: AccountService;
  const account: Account = {
    firstName: 'John',
    lastName: 'Doe',
    activated: true,
    email: 'john.doe@mail.com',
    langKey: 'en',
    login: 'john',
    authorities: [],
    imageUrl: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        {
          provide: AccountService,
          useValue: {
            authenticate: vi.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Settings);
    comp = fixture.componentInstance;
    mockAccountService = TestBed.inject(AccountService);
    mockAccountService.identity = vi.fn(() => of(account));
  });

  it('should send the current identity upon save', () => {
    // GIVEN
    mockAccountService.save = vi.fn(() => of({}));
    const settingsFormValues = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      langKey: 'en',
    };

    // WHEN
    comp.ngOnInit();
    comp.save();

    // THEN
    expect(mockAccountService.identity).toHaveBeenCalled();
    expect(mockAccountService.save).toHaveBeenCalledWith(account);
    expect(mockAccountService.authenticate).toHaveBeenCalledWith(account);
    expect(comp.settingsForm.value).toMatchObject(settingsFormValues);
  });

  it('should notify of success upon successful save', () => {
    // GIVEN
    mockAccountService.save = vi.fn(() => of({}));

    // WHEN
    comp.ngOnInit();
    comp.save();

    // THEN
    expect(comp.success()).toBe(true);
  });

  it('should notify of error upon failed save', () => {
    // GIVEN
    mockAccountService.save = vi.fn(() => throwError(Error));

    // WHEN
    comp.ngOnInit();
    comp.save();

    // THEN
    expect(comp.success()).toBe(false);
  });
});
