import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../bank-account.test-samples';

import { BankAccountFormService } from './bank-account-form.service';

describe('BankAccount Form Service', () => {
  let service: BankAccountFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankAccountFormService);
  });

  describe('Service methods', () => {
    describe('createBankAccountFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBankAccountFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            balance: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IBankAccount should create a new form with FormGroup', () => {
        const formGroup = service.createBankAccountFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            balance: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getBankAccount', () => {
      it('should return NewBankAccount for default BankAccount initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBankAccountFormGroup(sampleWithNewData);

        const bankAccount = service.getBankAccount(formGroup) as any;

        expect(bankAccount).toMatchObject(sampleWithNewData);
      });

      it('should return NewBankAccount for empty BankAccount initial value', () => {
        const formGroup = service.createBankAccountFormGroup();

        const bankAccount = service.getBankAccount(formGroup) as any;

        expect(bankAccount).toMatchObject({});
      });

      it('should return IBankAccount', () => {
        const formGroup = service.createBankAccountFormGroup(sampleWithRequiredData);

        const bankAccount = service.getBankAccount(formGroup) as any;

        expect(bankAccount).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBankAccount should not enable id FormControl', () => {
        const formGroup = service.createBankAccountFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBankAccount should disable id FormControl', () => {
        const formGroup = service.createBankAccountFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
