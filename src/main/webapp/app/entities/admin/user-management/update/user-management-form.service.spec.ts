import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../user-management.test-samples';

import { UserManagementFormService } from './user-management-form.service';

describe('UserManagement Form Service', () => {
  let service: UserManagementFormService;

  beforeEach(() => {
    service = TestBed.inject(UserManagementFormService);
  });

  describe('Service methods', () => {
    describe('createUserManagementFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserManagementFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            login: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            activated: expect.any(Object),
            langKey: expect.any(Object),
            imageUrl: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            authorities: expect.any(Object),
          }),
        );
      });

      it('passing IUserManagement should create a new form with FormGroup', () => {
        const formGroup = service.createUserManagementFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            login: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            activated: expect.any(Object),
            langKey: expect.any(Object),
            imageUrl: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            authorities: expect.any(Object),
          }),
        );
      });
    });

    describe('getUserManagement', () => {
      it('should return NewUserManagement for default UserManagement initial value', () => {
        const formGroup = service.createUserManagementFormGroup(sampleWithNewData);

        const userManagement = service.getUserManagement(formGroup);

        expect(userManagement).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserManagement for empty UserManagement initial value', () => {
        const formGroup = service.createUserManagementFormGroup();

        const userManagement = service.getUserManagement(formGroup);

        expect(userManagement).toMatchObject({});
      });

      it('should return IUserManagement', () => {
        const formGroup = service.createUserManagementFormGroup(sampleWithRequiredData);

        const userManagement = service.getUserManagement(formGroup);

        expect(userManagement).toMatchObject(sampleWithRequiredData);
      });
    });
  });
});
