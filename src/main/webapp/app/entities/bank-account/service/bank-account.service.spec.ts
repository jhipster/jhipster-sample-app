import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBankAccount, BankAccount } from '../bank-account.model';

import { BankAccountService } from './bank-account.service';

describe('BankAccount Service', () => {
  let service: BankAccountService;
  let httpMock: HttpTestingController;
  let elemDefault: IBankAccount;
  let expectedResult: IBankAccount | IBankAccount[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BankAccountService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      balance: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a BankAccount', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new BankAccount()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BankAccount', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          balance: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BankAccount', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new BankAccount()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BankAccount', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          balance: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a BankAccount', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBankAccountToCollectionIfMissing', () => {
      it('should add a BankAccount to an empty array', () => {
        const bankAccount: IBankAccount = { id: 123 };
        expectedResult = service.addBankAccountToCollectionIfMissing([], bankAccount);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bankAccount);
      });

      it('should not add a BankAccount to an array that contains it', () => {
        const bankAccount: IBankAccount = { id: 123 };
        const bankAccountCollection: IBankAccount[] = [
          {
            ...bankAccount,
          },
          { id: 456 },
        ];
        expectedResult = service.addBankAccountToCollectionIfMissing(bankAccountCollection, bankAccount);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BankAccount to an array that doesn't contain it", () => {
        const bankAccount: IBankAccount = { id: 123 };
        const bankAccountCollection: IBankAccount[] = [{ id: 456 }];
        expectedResult = service.addBankAccountToCollectionIfMissing(bankAccountCollection, bankAccount);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bankAccount);
      });

      it('should add only unique BankAccount to an array', () => {
        const bankAccountArray: IBankAccount[] = [{ id: 123 }, { id: 456 }, { id: 27720 }];
        const bankAccountCollection: IBankAccount[] = [{ id: 123 }];
        expectedResult = service.addBankAccountToCollectionIfMissing(bankAccountCollection, ...bankAccountArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bankAccount: IBankAccount = { id: 123 };
        const bankAccount2: IBankAccount = { id: 456 };
        expectedResult = service.addBankAccountToCollectionIfMissing([], bankAccount, bankAccount2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bankAccount);
        expect(expectedResult).toContain(bankAccount2);
      });

      it('should accept null and undefined values', () => {
        const bankAccount: IBankAccount = { id: 123 };
        expectedResult = service.addBankAccountToCollectionIfMissing([], null, bankAccount, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bankAccount);
      });

      it('should return initial array if no BankAccount is added', () => {
        const bankAccountCollection: IBankAccount[] = [{ id: 123 }];
        expectedResult = service.addBankAccountToCollectionIfMissing(bankAccountCollection, undefined, null);
        expect(expectedResult).toEqual(bankAccountCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
