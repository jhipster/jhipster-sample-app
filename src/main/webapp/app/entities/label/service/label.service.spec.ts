import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILabel, Label } from '../label.model';

import { LabelService } from './label.service';

describe('Label Service', () => {
  let service: LabelService;
  let httpMock: HttpTestingController;
  let elemDefault: ILabel;
  let expectedResult: ILabel | ILabel[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LabelService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      label: 'AAAAAAA',
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

    it('should create a Label', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Label()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Label', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          label: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Label', () => {
      const patchObject = Object.assign(
        {
          label: 'BBBBBB',
        },
        new Label()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Label', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          label: 'BBBBBB',
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

    it('should delete a Label', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLabelToCollectionIfMissing', () => {
      it('should add a Label to an empty array', () => {
        const label: ILabel = { id: 123 };
        expectedResult = service.addLabelToCollectionIfMissing([], label);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(label);
      });

      it('should not add a Label to an array that contains it', () => {
        const label: ILabel = { id: 123 };
        const labelCollection: ILabel[] = [
          {
            ...label,
          },
          { id: 456 },
        ];
        expectedResult = service.addLabelToCollectionIfMissing(labelCollection, label);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Label to an array that doesn't contain it", () => {
        const label: ILabel = { id: 123 };
        const labelCollection: ILabel[] = [{ id: 456 }];
        expectedResult = service.addLabelToCollectionIfMissing(labelCollection, label);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(label);
      });

      it('should add only unique Label to an array', () => {
        const labelArray: ILabel[] = [{ id: 123 }, { id: 456 }, { id: 78362 }];
        const labelCollection: ILabel[] = [{ id: 123 }];
        expectedResult = service.addLabelToCollectionIfMissing(labelCollection, ...labelArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const label: ILabel = { id: 123 };
        const label2: ILabel = { id: 456 };
        expectedResult = service.addLabelToCollectionIfMissing([], label, label2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(label);
        expect(expectedResult).toContain(label2);
      });

      it('should accept null and undefined values', () => {
        const label: ILabel = { id: 123 };
        expectedResult = service.addLabelToCollectionIfMissing([], null, label, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(label);
      });

      it('should return initial array if no Label is added', () => {
        const labelCollection: ILabel[] = [{ id: 123 }];
        expectedResult = service.addLabelToCollectionIfMissing(labelCollection, undefined, null);
        expect(expectedResult).toEqual(labelCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
