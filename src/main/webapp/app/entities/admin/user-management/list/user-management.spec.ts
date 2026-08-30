import { MockInstance, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEye, faPencilAlt, faPlus, faSort, faSortDown, faSortUp, faSync, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { provideTranslateService } from '@ngx-translate/core';
import { Subject, of } from 'rxjs';

import { UserManagementService } from '../service/user-management.service';
import { sampleWithRequiredData } from '../user-management.test-samples';

import { UserManagement } from './user-management';

vi.useFakeTimers();

describe('UserManagement Management Component', () => {
  let httpMock: HttpTestingController;
  let comp: UserManagement;
  let fixture: ComponentFixture<UserManagement>;
  let service: UserManagementService;
  let routerNavigateSpy: MockInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'login,asc',
            }),
            queryParamMap: of(
              convertToParamMap({
                page: '1',
                size: '1',
                sort: 'login,desc',
              }),
            ),
            snapshot: {
              queryParams: {},
              queryParamMap: convertToParamMap({
                page: '1',
                size: '1',
                sort: 'login,desc',
              }),
            },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(UserManagement);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserManagementService);
    routerNavigateSpy = vi.spyOn(comp.router, 'navigate');

    const library = TestBed.inject(FaIconLibrary);
    library.addIcons(faEye, faPencilAlt, faPlus, faSort, faSortDown, faSortUp, faSync, faTimes);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should call load all on init', async () => {
    // WHEN
    TestBed.tick();
    const req = httpMock.expectOne({ method: 'GET' });
    req.flush([{ login: 'Ozella.Kertzmann' }], { headers: { link: '<http://localhost/api/foo?page=1&size=20>; rel="next"' } });
    await vi.runAllTimersAsync();

    // THEN
    expect(comp.isLoading()).toEqual(false);
    expect(comp.userManagements()[0]).toEqual(expect.objectContaining({ login: 'Ozella.Kertzmann' }));
  });

  it('should cancel previous requests when loading a new page', async () => {
    // WHEN
    TestBed.tick();
    const req = httpMock.expectOne({ method: 'GET' });
    await vi.runAllTimersAsync();

    comp.page.set(3);
    comp.load();
    await vi.runAllTimersAsync();
    const req2 = httpMock.expectOne({ method: 'GET' });
    req2.flush([{ login: 'Ozella.Kertzmann' }], { headers: { link: '<http://localhost/api/foo?page=1&size=20>; rel="next"' } });
    await vi.runAllTimersAsync();

    // THEN
    expect(req.cancelled).toBeTruthy();
    expect(comp.isLoading()).toEqual(false);
    expect(comp.userManagements()[0]).toEqual(expect.objectContaining({ login: 'Ozella.Kertzmann' }));
  });

  it('should not fail on resource error state', async () => {
    // GIVEN - first load triggers an HTTP error
    TestBed.tick();
    const errorReq = httpMock.expectOne({ method: 'GET' });
    errorReq.flush('error', { status: 500, statusText: 'Server Error' });
    await vi.runAllTimersAsync();

    // THEN - loading state was reset and list is empty
    expect(comp.isLoading()).toBe(false);
    expect(comp.userManagements()).toEqual([]);

    // WHEN - second load should still work
    comp.load();
    TestBed.tick();
    const successReq = httpMock.expectOne({ method: 'GET' });
    successReq.flush([{ login: 'Ozella.Kertzmann' }], { headers: { link: '<http://localhost/api/foo?page=1&size=20>; rel="next"' } });
    await vi.runAllTimersAsync();

    // THEN - subscription is still alive and second load succeeds
    expect(comp.userManagements()[0]).toEqual(expect.objectContaining({ login: 'Ozella.Kertzmann' }));
  });

  describe('trackLogin', () => {
    it('should forward to userManagementService', () => {
      const entity = { login: 'Ozella.Kertzmann' };
      vi.spyOn(service, 'getUserManagementIdentifier');
      const login = comp.trackLogin(entity);
      expect(service.getUserManagementIdentifier).toHaveBeenCalledWith(entity);
      expect(login).toBe(entity.login);
    });
  });

  it('should calculate the sort attribute for a non-id attribute', () => {
    // WHEN
    comp.navigateToWithComponentValues({ predicate: 'non-existing-column', order: 'asc' });

    // THEN
    expect(routerNavigateSpy).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({
        queryParams: expect.objectContaining({
          sort: ['non-existing-column,asc'],
        }),
      }),
    );
  });

  it('should load a page', () => {
    // WHEN
    comp.navigateToPage(1);

    // THEN
    expect(routerNavigateSpy).toHaveBeenCalled();
  });

  it('should calculate the sort attribute for an id', () => {
    // WHEN
    TestBed.tick();
    httpMock.expectOne({ method: 'GET' });

    // THEN
    expect(service.userManagementsParams()).toMatchObject({ sort: ['login,desc'] });
  });

  describe('delete', () => {
    let ngbModal: NgbModal;
    let deleteModalMock: any;

    beforeEach(() => {
      deleteModalMock = { componentInstance: {}, closed: new Subject() };
      // NgbModal is not a singleton using TestBed.inject.
      // ngbModal = TestBed.inject(NgbModal);
      ngbModal = (comp as unknown as { modalService: NgbModal }).modalService;
      vi.spyOn(ngbModal, 'open').mockReturnValue(deleteModalMock);
    });

    it('on confirm should call load', () => {
      // GIVEN
      vi.spyOn(comp, 'load');

      // WHEN
      comp.delete(sampleWithRequiredData);
      deleteModalMock.closed.next('deleted');

      // THEN
      expect(ngbModal.open).toHaveBeenCalled();
      expect(comp.load).toHaveBeenCalled();
    });

    it('on dismiss should call load', () => {
      // GIVEN
      vi.spyOn(comp, 'load');

      // WHEN
      comp.delete(sampleWithRequiredData);
      deleteModalMock.closed.next();

      // THEN
      expect(ngbModal.open).toHaveBeenCalled();
      expect(comp.load).not.toHaveBeenCalled();
    });
  });
});
