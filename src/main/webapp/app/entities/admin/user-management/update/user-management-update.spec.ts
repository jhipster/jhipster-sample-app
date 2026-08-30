import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { UserManagementService } from '../service/user-management.service';
import { IUserManagement } from '../user-management.model';

import { UserManagementFormService } from './user-management-form.service';
import { UserManagementUpdate } from './user-management-update';

describe('UserManagement Management Update Component', () => {
  let comp: UserManagementUpdate;
  let fixture: ComponentFixture<UserManagementUpdate>;
  let activatedRoute: ActivatedRoute;
  let userManagementFormService: UserManagementFormService;
  let userManagementService: UserManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(UserManagementUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userManagementFormService = TestBed.inject(UserManagementFormService);
    userManagementService = TestBed.inject(UserManagementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const userManagement: IUserManagement = { login: 'Anya.Schiller33' };

      activatedRoute.data = of({ userManagement });
      comp.ngOnInit();

      expect(comp.userManagement).toEqual(userManagement);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IUserManagement>();
      const userManagement = { login: 'Ozella.Kertzmann' };
      vi.spyOn(userManagementFormService, 'getUserManagement').mockReturnValue(userManagement);
      vi.spyOn(userManagementService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userManagement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(userManagement);
      saveSubject.complete();

      // THEN
      expect(userManagementFormService.getUserManagement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userManagementService.update).toHaveBeenCalledWith(expect.objectContaining(userManagement));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IUserManagement>();
      const userManagement = { login: 'Ozella.Kertzmann' };
      vi.spyOn(userManagementFormService, 'getUserManagement').mockReturnValue({ id: null, login: null });
      vi.spyOn(userManagementService, 'create').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userManagement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(userManagement);
      saveSubject.complete();

      // THEN
      expect(userManagementFormService.getUserManagement).toHaveBeenCalled();
      expect(userManagementService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IUserManagement>();
      const userManagement = { id: 123, login: 'Ozella.Kertzmann' };
      vi.spyOn(userManagementService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userManagement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userManagementService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
