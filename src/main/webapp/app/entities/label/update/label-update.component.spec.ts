jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LabelService } from '../service/label.service';
import { ILabel, Label } from '../label.model';

import { LabelUpdateComponent } from './label-update.component';

describe('Component Tests', () => {
  describe('Label Management Update Component', () => {
    let comp: LabelUpdateComponent;
    let fixture: ComponentFixture<LabelUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let labelService: LabelService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LabelUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(LabelUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LabelUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      labelService = TestBed.inject(LabelService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const label: ILabel = { id: 456 };

        activatedRoute.data = of({ label });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(label));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Label>>();
        const label = { id: 123 };
        jest.spyOn(labelService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ label });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: label }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(labelService.update).toHaveBeenCalledWith(label);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Label>>();
        const label = new Label();
        jest.spyOn(labelService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ label });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: label }));
        saveSubject.complete();

        // THEN
        expect(labelService.create).toHaveBeenCalledWith(label);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Label>>();
        const label = { id: 123 };
        jest.spyOn(labelService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ label });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(labelService.update).toHaveBeenCalledWith(label);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
