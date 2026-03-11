import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { UserService } from 'app/entities/user/service/user.service';
import { IUser } from 'app/entities/user/user.model';
import { IBankAccount } from '../bank-account.model';
import { BankAccountService } from '../service/bank-account.service';

import { BankAccountFormService } from './bank-account-form.service';
import { BankAccountUpdate } from './bank-account-update';

describe('BankAccount Management Update Component', () => {
  let comp: BankAccountUpdate;
  let fixture: ComponentFixture<BankAccountUpdate>;
  let activatedRoute: ActivatedRoute;
  let bankAccountFormService: BankAccountFormService;
  let bankAccountService: BankAccountService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(BankAccountUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bankAccountFormService = TestBed.inject(BankAccountFormService);
    bankAccountService = TestBed.inject(BankAccountService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call User query and add missing value', () => {
      const bankAccount: IBankAccount = { id: 22583 };
      const user: IUser = { id: 3944 };
      bankAccount.user = user;

      const userCollection: IUser[] = [{ id: 3944 }];
      vitest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      vitest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bankAccount });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.usersSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const bankAccount: IBankAccount = { id: 22583 };
      const user: IUser = { id: 3944 };
      bankAccount.user = user;

      activatedRoute.data = of({ bankAccount });
      comp.ngOnInit();

      expect(comp.usersSharedCollection()).toContainEqual(user);
      expect(comp.bankAccount).toEqual(bankAccount);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IBankAccount>();
      const bankAccount = { id: 22720 };
      vitest.spyOn(bankAccountFormService, 'getBankAccount').mockReturnValue(bankAccount);
      vitest.spyOn(bankAccountService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankAccount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(bankAccount);
      saveSubject.complete();

      // THEN
      expect(bankAccountFormService.getBankAccount).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bankAccountService.update).toHaveBeenCalledWith(expect.objectContaining(bankAccount));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IBankAccount>();
      const bankAccount = { id: 22720 };
      vitest.spyOn(bankAccountFormService, 'getBankAccount').mockReturnValue({ id: null });
      vitest.spyOn(bankAccountService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankAccount: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(bankAccount);
      saveSubject.complete();

      // THEN
      expect(bankAccountFormService.getBankAccount).toHaveBeenCalled();
      expect(bankAccountService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IBankAccount>();
      const bankAccount = { id: 22720 };
      vitest.spyOn(bankAccountService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankAccount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bankAccountService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('should forward to userService', () => {
        const entity = { id: 3944 };
        const entity2 = { id: 6275 };
        vitest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
