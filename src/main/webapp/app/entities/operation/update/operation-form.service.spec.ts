import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../operation.test-samples';

import { OperationFormService } from './operation-form.service';

describe('Operation Form Service', () => {
  let service: OperationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationFormService);
  });

  describe('Service methods', () => {
    describe('createOperationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOperationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            description: expect.any(Object),
            amount: expect.any(Object),
            bankAccount: expect.any(Object),
            labels: expect.any(Object),
          })
        );
      });

      it('passing IOperation should create a new form with FormGroup', () => {
        const formGroup = service.createOperationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            description: expect.any(Object),
            amount: expect.any(Object),
            bankAccount: expect.any(Object),
            labels: expect.any(Object),
          })
        );
      });
    });

    describe('getOperation', () => {
      it('should return NewOperation for default Operation initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOperationFormGroup(sampleWithNewData);

        const operation = service.getOperation(formGroup) as any;

        expect(operation).toMatchObject(sampleWithNewData);
      });

      it('should return NewOperation for empty Operation initial value', () => {
        const formGroup = service.createOperationFormGroup();

        const operation = service.getOperation(formGroup) as any;

        expect(operation).toMatchObject({});
      });

      it('should return IOperation', () => {
        const formGroup = service.createOperationFormGroup(sampleWithRequiredData);

        const operation = service.getOperation(formGroup) as any;

        expect(operation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOperation should not enable id FormControl', () => {
        const formGroup = service.createOperationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOperation should disable id FormControl', () => {
        const formGroup = service.createOperationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
