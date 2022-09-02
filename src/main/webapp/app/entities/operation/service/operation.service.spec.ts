import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOperation } from '../operation.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../operation.test-samples';

import { OperationService, RestOperation } from './operation.service';

const requireRestSample: RestOperation = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('Operation Service', () => {
  let service: OperationService;
  let httpMock: HttpTestingController;
  let expectedResult: IOperation | IOperation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OperationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Operation', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const operation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(operation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Operation', () => {
      const operation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(operation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Operation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Operation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Operation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOperationToCollectionIfMissing', () => {
      it('should add a Operation to an empty array', () => {
        const operation: IOperation = sampleWithRequiredData;
        expectedResult = service.addOperationToCollectionIfMissing([], operation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(operation);
      });

      it('should not add a Operation to an array that contains it', () => {
        const operation: IOperation = sampleWithRequiredData;
        const operationCollection: IOperation[] = [
          {
            ...operation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOperationToCollectionIfMissing(operationCollection, operation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Operation to an array that doesn't contain it", () => {
        const operation: IOperation = sampleWithRequiredData;
        const operationCollection: IOperation[] = [sampleWithPartialData];
        expectedResult = service.addOperationToCollectionIfMissing(operationCollection, operation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(operation);
      });

      it('should add only unique Operation to an array', () => {
        const operationArray: IOperation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const operationCollection: IOperation[] = [sampleWithRequiredData];
        expectedResult = service.addOperationToCollectionIfMissing(operationCollection, ...operationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const operation: IOperation = sampleWithRequiredData;
        const operation2: IOperation = sampleWithPartialData;
        expectedResult = service.addOperationToCollectionIfMissing([], operation, operation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(operation);
        expect(expectedResult).toContain(operation2);
      });

      it('should accept null and undefined values', () => {
        const operation: IOperation = sampleWithRequiredData;
        expectedResult = service.addOperationToCollectionIfMissing([], null, operation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(operation);
      });

      it('should return initial array if no Operation is added', () => {
        const operationCollection: IOperation[] = [sampleWithRequiredData];
        expectedResult = service.addOperationToCollectionIfMissing(operationCollection, undefined, null);
        expect(expectedResult).toEqual(operationCollection);
      });
    });

    describe('compareOperation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOperation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOperation(entity1, entity2);
        const compareResult2 = service.compareOperation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOperation(entity1, entity2);
        const compareResult2 = service.compareOperation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOperation(entity1, entity2);
        const compareResult2 = service.compareOperation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
