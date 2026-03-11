import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IBankAccount } from 'app/entities/bank-account/bank-account.model';
import { BankAccountService } from 'app/entities/bank-account/service/bank-account.service';
import { ILabel } from 'app/entities/label/label.model';
import { LabelService } from 'app/entities/label/service/label.service';
import { IOperation } from '../operation.model';
import { OperationService } from '../service/operation.service';

import { OperationFormService } from './operation-form.service';
import { OperationUpdate } from './operation-update';

describe('Operation Management Update Component', () => {
  let comp: OperationUpdate;
  let fixture: ComponentFixture<OperationUpdate>;
  let activatedRoute: ActivatedRoute;
  let operationFormService: OperationFormService;
  let operationService: OperationService;
  let bankAccountService: BankAccountService;
  let labelService: LabelService;

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

    fixture = TestBed.createComponent(OperationUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    operationFormService = TestBed.inject(OperationFormService);
    operationService = TestBed.inject(OperationService);
    bankAccountService = TestBed.inject(BankAccountService);
    labelService = TestBed.inject(LabelService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call BankAccount query and add missing value', () => {
      const operation: IOperation = { id: 5986 };
      const bankAccount: IBankAccount = { id: 22720 };
      operation.bankAccount = bankAccount;

      const bankAccountCollection: IBankAccount[] = [{ id: 22720 }];
      vitest.spyOn(bankAccountService, 'query').mockReturnValue(of(new HttpResponse({ body: bankAccountCollection })));
      const additionalBankAccounts = [bankAccount];
      const expectedCollection: IBankAccount[] = [...additionalBankAccounts, ...bankAccountCollection];
      vitest.spyOn(bankAccountService, 'addBankAccountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ operation });
      comp.ngOnInit();

      expect(bankAccountService.query).toHaveBeenCalled();
      expect(bankAccountService.addBankAccountToCollectionIfMissing).toHaveBeenCalledWith(
        bankAccountCollection,
        ...additionalBankAccounts.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.bankAccountsSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Label query and add missing value', () => {
      const operation: IOperation = { id: 5986 };
      const labels: ILabel[] = [{ id: 4199 }];
      operation.labels = labels;

      const labelCollection: ILabel[] = [{ id: 4199 }];
      vitest.spyOn(labelService, 'query').mockReturnValue(of(new HttpResponse({ body: labelCollection })));
      const additionalLabels = [...labels];
      const expectedCollection: ILabel[] = [...additionalLabels, ...labelCollection];
      vitest.spyOn(labelService, 'addLabelToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ operation });
      comp.ngOnInit();

      expect(labelService.query).toHaveBeenCalled();
      expect(labelService.addLabelToCollectionIfMissing).toHaveBeenCalledWith(
        labelCollection,
        ...additionalLabels.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.labelsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const operation: IOperation = { id: 5986 };
      const bankAccount: IBankAccount = { id: 22720 };
      operation.bankAccount = bankAccount;
      const label: ILabel = { id: 4199 };
      operation.labels = [label];

      activatedRoute.data = of({ operation });
      comp.ngOnInit();

      expect(comp.bankAccountsSharedCollection()).toContainEqual(bankAccount);
      expect(comp.labelsSharedCollection()).toContainEqual(label);
      expect(comp.operation).toEqual(operation);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IOperation>();
      const operation = { id: 13822 };
      vitest.spyOn(operationFormService, 'getOperation').mockReturnValue(operation);
      vitest.spyOn(operationService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ operation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(operation);
      saveSubject.complete();

      // THEN
      expect(operationFormService.getOperation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(operationService.update).toHaveBeenCalledWith(expect.objectContaining(operation));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IOperation>();
      const operation = { id: 13822 };
      vitest.spyOn(operationFormService, 'getOperation').mockReturnValue({ id: null });
      vitest.spyOn(operationService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ operation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(operation);
      saveSubject.complete();

      // THEN
      expect(operationFormService.getOperation).toHaveBeenCalled();
      expect(operationService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IOperation>();
      const operation = { id: 13822 };
      vitest.spyOn(operationService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ operation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(operationService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBankAccount', () => {
      it('should forward to bankAccountService', () => {
        const entity = { id: 22720 };
        const entity2 = { id: 22583 };
        vitest.spyOn(bankAccountService, 'compareBankAccount');
        comp.compareBankAccount(entity, entity2);
        expect(bankAccountService.compareBankAccount).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareLabel', () => {
      it('should forward to labelService', () => {
        const entity = { id: 4199 };
        const entity2 = { id: 7351 };
        vitest.spyOn(labelService, 'compareLabel');
        comp.compareLabel(entity, entity2);
        expect(labelService.compareLabel).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
