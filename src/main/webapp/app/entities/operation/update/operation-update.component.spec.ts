jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OperationService } from '../service/operation.service';
import { IOperation, Operation } from '../operation.model';
import { IBankAccount } from 'app/entities/bank-account/bank-account.model';
import { BankAccountService } from 'app/entities/bank-account/service/bank-account.service';
import { ILabel } from 'app/entities/label/label.model';
import { LabelService } from 'app/entities/label/service/label.service';

import { OperationUpdateComponent } from './operation-update.component';

describe('Component Tests', () => {
  describe('Operation Management Update Component', () => {
    let comp: OperationUpdateComponent;
    let fixture: ComponentFixture<OperationUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let operationService: OperationService;
    let bankAccountService: BankAccountService;
    let labelService: LabelService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OperationUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(OperationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OperationUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      operationService = TestBed.inject(OperationService);
      bankAccountService = TestBed.inject(BankAccountService);
      labelService = TestBed.inject(LabelService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call BankAccount query and add missing value', () => {
        const operation: IOperation = { id: 456 };
        const bankAccount: IBankAccount = { id: 65249 };
        operation.bankAccount = bankAccount;

        const bankAccountCollection: IBankAccount[] = [{ id: 39284 }];
        jest.spyOn(bankAccountService, 'query').mockReturnValue(of(new HttpResponse({ body: bankAccountCollection })));
        const additionalBankAccounts = [bankAccount];
        const expectedCollection: IBankAccount[] = [...additionalBankAccounts, ...bankAccountCollection];
        jest.spyOn(bankAccountService, 'addBankAccountToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ operation });
        comp.ngOnInit();

        expect(bankAccountService.query).toHaveBeenCalled();
        expect(bankAccountService.addBankAccountToCollectionIfMissing).toHaveBeenCalledWith(
          bankAccountCollection,
          ...additionalBankAccounts
        );
        expect(comp.bankAccountsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Label query and add missing value', () => {
        const operation: IOperation = { id: 456 };
        const labels: ILabel[] = [{ id: 647 }];
        operation.labels = labels;

        const labelCollection: ILabel[] = [{ id: 16623 }];
        jest.spyOn(labelService, 'query').mockReturnValue(of(new HttpResponse({ body: labelCollection })));
        const additionalLabels = [...labels];
        const expectedCollection: ILabel[] = [...additionalLabels, ...labelCollection];
        jest.spyOn(labelService, 'addLabelToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ operation });
        comp.ngOnInit();

        expect(labelService.query).toHaveBeenCalled();
        expect(labelService.addLabelToCollectionIfMissing).toHaveBeenCalledWith(labelCollection, ...additionalLabels);
        expect(comp.labelsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const operation: IOperation = { id: 456 };
        const bankAccount: IBankAccount = { id: 53557 };
        operation.bankAccount = bankAccount;
        const labels: ILabel = { id: 2284 };
        operation.labels = [labels];

        activatedRoute.data = of({ operation });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(operation));
        expect(comp.bankAccountsSharedCollection).toContain(bankAccount);
        expect(comp.labelsSharedCollection).toContain(labels);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Operation>>();
        const operation = { id: 123 };
        jest.spyOn(operationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ operation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: operation }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(operationService.update).toHaveBeenCalledWith(operation);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Operation>>();
        const operation = new Operation();
        jest.spyOn(operationService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ operation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: operation }));
        saveSubject.complete();

        // THEN
        expect(operationService.create).toHaveBeenCalledWith(operation);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Operation>>();
        const operation = { id: 123 };
        jest.spyOn(operationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ operation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(operationService.update).toHaveBeenCalledWith(operation);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackBankAccountById', () => {
        it('Should return tracked BankAccount primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBankAccountById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackLabelById', () => {
        it('Should return tracked Label primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackLabelById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedLabel', () => {
        it('Should return option if no Label is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedLabel(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Label for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedLabel(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Label is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedLabel(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
