import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IUserManagement } from '../user-management.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../user-management.test-samples';

import { RestUserManagement, UserManagementService } from './user-management.service';

const requireRestSample: RestUserManagement = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('UserManagement Service', () => {
  let service: UserManagementService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserManagement | IUserManagement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(UserManagementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('ABC').subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a UserManagement', () => {
      const userManagement = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userManagement).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserManagement', () => {
      const userManagement = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userManagement).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserManagement', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserManagement', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserManagement', () => {
      service.delete('ABC').subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests).toHaveLength(1);
    });

    describe('addUserManagementToCollectionIfMissing', () => {
      it('should add a UserManagement to an empty array', () => {
        const userManagement: IUserManagement = sampleWithRequiredData;
        expectedResult = service.addUserManagementToCollectionIfMissing([], userManagement);
        expect(expectedResult).toEqual([userManagement]);
      });

      it('should not add a UserManagement to an array that contains it', () => {
        const userManagement: IUserManagement = sampleWithRequiredData;
        const userManagementCollection: IUserManagement[] = [
          {
            ...userManagement,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserManagementToCollectionIfMissing(userManagementCollection, userManagement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserManagement to an array that doesn't contain it", () => {
        const userManagement: IUserManagement = sampleWithRequiredData;
        const userManagementCollection: IUserManagement[] = [sampleWithPartialData];
        expectedResult = service.addUserManagementToCollectionIfMissing(userManagementCollection, userManagement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userManagement);
      });

      it('should add only unique UserManagement to an array', () => {
        const userManagementArray: IUserManagement[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userManagementCollection: IUserManagement[] = [sampleWithRequiredData];
        expectedResult = service.addUserManagementToCollectionIfMissing(userManagementCollection, ...userManagementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userManagement: IUserManagement = sampleWithRequiredData;
        const userManagement2: IUserManagement = sampleWithPartialData;
        expectedResult = service.addUserManagementToCollectionIfMissing([], userManagement, userManagement2);
        expect(expectedResult).toEqual([userManagement, userManagement2]);
      });

      it('should accept null and undefined values', () => {
        const userManagement: IUserManagement = sampleWithRequiredData;
        expectedResult = service.addUserManagementToCollectionIfMissing([], null, userManagement, undefined);
        expect(expectedResult).toEqual([userManagement]);
      });

      it('should return initial array if no UserManagement is added', () => {
        const userManagementCollection: IUserManagement[] = [sampleWithRequiredData];
        expectedResult = service.addUserManagementToCollectionIfMissing(userManagementCollection, undefined, null);
        expect(expectedResult).toEqual(userManagementCollection);
      });
    });

    describe('compareUserManagement', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserManagement(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { login: 'Ozella.Kertzmann' };
        const entity2 = null;

        const compareResult1 = service.compareUserManagement(entity1, entity2);
        const compareResult2 = service.compareUserManagement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { login: 'Ozella.Kertzmann' };
        const entity2 = { login: 'Anya.Schiller33' };

        const compareResult1 = service.compareUserManagement(entity1, entity2);
        const compareResult2 = service.compareUserManagement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return true if primaryKey matches', () => {
        const entity1 = { login: 'Ozella.Kertzmann' };
        const entity2 = { login: 'Ozella.Kertzmann' };

        const compareResult1 = service.compareUserManagement(entity1, entity2);
        const compareResult2 = service.compareUserManagement(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
