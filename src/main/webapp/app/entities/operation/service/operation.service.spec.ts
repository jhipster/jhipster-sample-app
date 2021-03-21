import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IOperation, Operation } from '../operation.model';

import { OperationService } from './operation.service';

describe('Service Tests', () => {
  describe('Operation Service', () => {
    let service: OperationService;
    let httpMock: HttpTestingController;
    let elemDefault: IOperation;
    let expectedResult: IOperation | IOperation[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(OperationService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        date: currentDate,
        description: 'AAAAAAA',
        amount: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            date: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Operation', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            date: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.create(new Operation()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Operation', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            date: currentDate.format(DATE_TIME_FORMAT),
            description: 'BBBBBB',
            amount: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Operation', () => {
        const patchObject = Object.assign(
          {
            description: 'BBBBBB',
            amount: 1,
          },
          new Operation()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Operation', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            date: currentDate.format(DATE_TIME_FORMAT),
            description: 'BBBBBB',
            amount: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Operation', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addOperationToCollectionIfMissing', () => {
        it('should add a Operation to an empty array', () => {
          const operation: IOperation = { id: 123 };
          expectedResult = service.addOperationToCollectionIfMissing([], operation);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(operation);
        });

        it('should not add a Operation to an array that contains it', () => {
          const operation: IOperation = { id: 123 };
          const operationCollection: IOperation[] = [
            {
              ...operation,
            },
            { id: 456 },
          ];
          expectedResult = service.addOperationToCollectionIfMissing(operationCollection, operation);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Operation to an array that doesn't contain it", () => {
          const operation: IOperation = { id: 123 };
          const operationCollection: IOperation[] = [{ id: 456 }];
          expectedResult = service.addOperationToCollectionIfMissing(operationCollection, operation);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(operation);
        });

        it('should add only unique Operation to an array', () => {
          const operationArray: IOperation[] = [{ id: 123 }, { id: 456 }, { id: 46509 }];
          const operationCollection: IOperation[] = [{ id: 123 }];
          expectedResult = service.addOperationToCollectionIfMissing(operationCollection, ...operationArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const operation: IOperation = { id: 123 };
          const operation2: IOperation = { id: 456 };
          expectedResult = service.addOperationToCollectionIfMissing([], operation, operation2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(operation);
          expect(expectedResult).toContain(operation2);
        });

        it('should accept null and undefined values', () => {
          const operation: IOperation = { id: 123 };
          expectedResult = service.addOperationToCollectionIfMissing([], null, operation, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(operation);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
