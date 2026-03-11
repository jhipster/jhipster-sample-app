import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { Authority } from 'app/shared/jhipster/constants';
import { UserManagementService } from '../service/user-management.service';
import { IUserManagement } from '../user-management.model';

import { UserManagementUpdate } from './user-management-update';

describe('User Management Update Component', () => {
  let comp: UserManagementUpdate;
  let fixture: ComponentFixture<UserManagementUpdate>;
  let service: UserManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              user: {
                id: 123,
                login: 'user',
                firstName: 'first',
                lastName: 'last',
                email: 'first@last.com',
                activated: true,
                langKey: 'en',
                authorities: [Authority.USER],
                createdBy: 'admin',
              } as IUserManagement,
            }),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementUpdate);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserManagementService);
  });

  describe('save', () => {
    it('should call update service on save for existing user', inject([], () => {
      // GIVEN
      const entity = { id: 123 } as IUserManagement;
      vitest.spyOn(service, 'update').mockReturnValue(of(entity));
      comp.editForm.patchValue(entity);
      // WHEN
      comp.save();

      // THEN
      expect(service.update).toHaveBeenCalledWith(expect.objectContaining(entity));
      expect(comp.isSaving()).toEqual(false);
    }));

    it('should call create service on save for new user', inject([], () => {
      // GIVEN
      const entity = { login: 'foo' } as IUserManagement;
      vitest.spyOn(service, 'create').mockReturnValue(of(entity));
      comp.editForm.patchValue(entity);
      // WHEN
      comp.save();

      // THEN
      expect(comp.editForm.getRawValue().id).toBeNull();
      expect(service.create).toHaveBeenCalledWith(expect.objectContaining(entity));
      expect(comp.isSaving()).toEqual(false);
    }));
  });
});
