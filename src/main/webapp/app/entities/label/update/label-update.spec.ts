import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IOperation } from 'app/entities/operation/operation.model';
import { OperationService } from 'app/entities/operation/service/operation.service';
import { ILabel } from '../label.model';
import { LabelService } from '../service/label.service';

import { LabelFormService } from './label-form.service';
import { LabelUpdate } from './label-update';

describe('Label Management Update Component', () => {
  let comp: LabelUpdate;
  let fixture: ComponentFixture<LabelUpdate>;
  let activatedRoute: ActivatedRoute;
  let labelFormService: LabelFormService;
  let labelService: LabelService;
  let operationService: OperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(LabelUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    labelFormService = TestBed.inject(LabelFormService);
    labelService = TestBed.inject(LabelService);
    operationService = TestBed.inject(OperationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Operation query and add missing value', () => {
      const label: ILabel = { id: 7351 };
      const operations: IOperation[] = [{ id: 13822 }];
      label.operations = operations;

      const operationCollection: IOperation[] = [{ id: 13822 }];
      vitest.spyOn(operationService, 'query').mockReturnValue(of(new HttpResponse({ body: operationCollection })));
      const additionalOperations = [...operations];
      const expectedCollection: IOperation[] = [...additionalOperations, ...operationCollection];
      vitest.spyOn(operationService, 'addOperationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ label });
      comp.ngOnInit();

      expect(operationService.query).toHaveBeenCalled();
      expect(operationService.addOperationToCollectionIfMissing).toHaveBeenCalledWith(
        operationCollection,
        ...additionalOperations.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.operationsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const label: ILabel = { id: 7351 };
      const operation: IOperation = { id: 13822 };
      label.operations = [operation];

      activatedRoute.data = of({ label });
      comp.ngOnInit();

      expect(comp.operationsSharedCollection()).toContainEqual(operation);
      expect(comp.label).toEqual(label);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<ILabel>();
      const label = { id: 4199 };
      vitest.spyOn(labelFormService, 'getLabel').mockReturnValue(label);
      vitest.spyOn(labelService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ label });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(label);
      saveSubject.complete();

      // THEN
      expect(labelFormService.getLabel).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(labelService.update).toHaveBeenCalledWith(expect.objectContaining(label));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<ILabel>();
      const label = { id: 4199 };
      vitest.spyOn(labelFormService, 'getLabel').mockReturnValue({ id: null });
      vitest.spyOn(labelService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ label: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(label);
      saveSubject.complete();

      // THEN
      expect(labelFormService.getLabel).toHaveBeenCalled();
      expect(labelService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<ILabel>();
      const label = { id: 4199 };
      vitest.spyOn(labelService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ label });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(labelService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareOperation', () => {
      it('should forward to operationService', () => {
        const entity = { id: 13822 };
        const entity2 = { id: 5986 };
        vitest.spyOn(operationService, 'compareOperation');
        comp.compareOperation(entity, entity2);
        expect(operationService.compareOperation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
