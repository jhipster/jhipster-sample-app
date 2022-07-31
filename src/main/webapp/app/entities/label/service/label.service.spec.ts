import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILabel } from '../label.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../label.test-samples';

import { LabelService } from './label.service';

const requireRestSample: ILabel = {
  ...sampleWithRequiredData,
};

describe('Label Service', () => {
  let service: LabelService;
  let httpMock: HttpTestingController;
  let expectedResult: ILabel | ILabel[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LabelService);
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

    it('should create a Label', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const label = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(label).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Label', () => {
      const label = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(label).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Label', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Label', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Label', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLabelToCollectionIfMissing', () => {
      it('should add a Label to an empty array', () => {
        const label: ILabel = sampleWithRequiredData;
        expectedResult = service.addLabelToCollectionIfMissing([], label);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(label);
      });

      it('should not add a Label to an array that contains it', () => {
        const label: ILabel = sampleWithRequiredData;
        const labelCollection: ILabel[] = [
          {
            ...label,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLabelToCollectionIfMissing(labelCollection, label);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Label to an array that doesn't contain it", () => {
        const label: ILabel = sampleWithRequiredData;
        const labelCollection: ILabel[] = [sampleWithPartialData];
        expectedResult = service.addLabelToCollectionIfMissing(labelCollection, label);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(label);
      });

      it('should add only unique Label to an array', () => {
        const labelArray: ILabel[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const labelCollection: ILabel[] = [sampleWithRequiredData];
        expectedResult = service.addLabelToCollectionIfMissing(labelCollection, ...labelArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const label: ILabel = sampleWithRequiredData;
        const label2: ILabel = sampleWithPartialData;
        expectedResult = service.addLabelToCollectionIfMissing([], label, label2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(label);
        expect(expectedResult).toContain(label2);
      });

      it('should accept null and undefined values', () => {
        const label: ILabel = sampleWithRequiredData;
        expectedResult = service.addLabelToCollectionIfMissing([], null, label, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(label);
      });

      it('should return initial array if no Label is added', () => {
        const labelCollection: ILabel[] = [sampleWithRequiredData];
        expectedResult = service.addLabelToCollectionIfMissing(labelCollection, undefined, null);
        expect(expectedResult).toEqual(labelCollection);
      });
    });

    describe('compareLabel', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLabel(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLabel(entity1, entity2);
        const compareResult2 = service.compareLabel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLabel(entity1, entity2);
        const compareResult2 = service.compareLabel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLabel(entity1, entity2);
        const compareResult2 = service.compareLabel(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
