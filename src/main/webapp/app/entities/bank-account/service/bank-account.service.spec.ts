import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBankAccount } from '../bank-account.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../bank-account.test-samples';

import { BankAccountService } from './bank-account.service';

const requireRestSample: IBankAccount = {
  ...sampleWithRequiredData,
};

describe('BankAccount Service', () => {
  let service: BankAccountService;
  let httpMock: HttpTestingController;
  let expectedResult: IBankAccount | IBankAccount[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BankAccountService);
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

    it('should create a BankAccount', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const bankAccount = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(bankAccount).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BankAccount', () => {
      const bankAccount = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(bankAccount).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BankAccount', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BankAccount', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BankAccount', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBankAccountToCollectionIfMissing', () => {
      it('should add a BankAccount to an empty array', () => {
        const bankAccount: IBankAccount = sampleWithRequiredData;
        expectedResult = service.addBankAccountToCollectionIfMissing([], bankAccount);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bankAccount);
      });

      it('should not add a BankAccount to an array that contains it', () => {
        const bankAccount: IBankAccount = sampleWithRequiredData;
        const bankAccountCollection: IBankAccount[] = [
          {
            ...bankAccount,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBankAccountToCollectionIfMissing(bankAccountCollection, bankAccount);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BankAccount to an array that doesn't contain it", () => {
        const bankAccount: IBankAccount = sampleWithRequiredData;
        const bankAccountCollection: IBankAccount[] = [sampleWithPartialData];
        expectedResult = service.addBankAccountToCollectionIfMissing(bankAccountCollection, bankAccount);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bankAccount);
      });

      it('should add only unique BankAccount to an array', () => {
        const bankAccountArray: IBankAccount[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const bankAccountCollection: IBankAccount[] = [sampleWithRequiredData];
        expectedResult = service.addBankAccountToCollectionIfMissing(bankAccountCollection, ...bankAccountArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bankAccount: IBankAccount = sampleWithRequiredData;
        const bankAccount2: IBankAccount = sampleWithPartialData;
        expectedResult = service.addBankAccountToCollectionIfMissing([], bankAccount, bankAccount2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bankAccount);
        expect(expectedResult).toContain(bankAccount2);
      });

      it('should accept null and undefined values', () => {
        const bankAccount: IBankAccount = sampleWithRequiredData;
        expectedResult = service.addBankAccountToCollectionIfMissing([], null, bankAccount, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bankAccount);
      });

      it('should return initial array if no BankAccount is added', () => {
        const bankAccountCollection: IBankAccount[] = [sampleWithRequiredData];
        expectedResult = service.addBankAccountToCollectionIfMissing(bankAccountCollection, undefined, null);
        expect(expectedResult).toEqual(bankAccountCollection);
      });
    });

    describe('compareBankAccount', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBankAccount(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBankAccount(entity1, entity2);
        const compareResult2 = service.compareBankAccount(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBankAccount(entity1, entity2);
        const compareResult2 = service.compareBankAccount(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBankAccount(entity1, entity2);
        const compareResult2 = service.compareBankAccount(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
