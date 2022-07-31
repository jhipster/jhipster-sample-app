import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../label.test-samples';

import { LabelFormService } from './label-form.service';

describe('Label Form Service', () => {
  let service: LabelFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabelFormService);
  });

  describe('Service methods', () => {
    describe('createLabelFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLabelFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            label: expect.any(Object),
            operations: expect.any(Object),
          })
        );
      });

      it('passing ILabel should create a new form with FormGroup', () => {
        const formGroup = service.createLabelFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            label: expect.any(Object),
            operations: expect.any(Object),
          })
        );
      });
    });

    describe('getLabel', () => {
      it('should return NewLabel for default Label initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLabelFormGroup(sampleWithNewData);

        const label = service.getLabel(formGroup) as any;

        expect(label).toMatchObject(sampleWithNewData);
      });

      it('should return NewLabel for empty Label initial value', () => {
        const formGroup = service.createLabelFormGroup();

        const label = service.getLabel(formGroup) as any;

        expect(label).toMatchObject({});
      });

      it('should return ILabel', () => {
        const formGroup = service.createLabelFormGroup(sampleWithRequiredData);

        const label = service.getLabel(formGroup) as any;

        expect(label).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILabel should not enable id FormControl', () => {
        const formGroup = service.createLabelFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLabel should disable id FormControl', () => {
        const formGroup = service.createLabelFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
