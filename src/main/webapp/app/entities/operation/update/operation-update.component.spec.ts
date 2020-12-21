jest.mock('@angular/router');

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OperationService } from '../service/operation.service';
import { Operation } from '../operation.model';
import { BankAccount } from 'app/entities/bank-account/bank-account.model';
import { Label } from 'app/entities/label/label.model';

import { OperationUpdateComponent } from './operation-update.component';

describe('Component Tests', () => {
  describe('Operation Management Update Component', () => {
    let comp: OperationUpdateComponent;
    let fixture: ComponentFixture<OperationUpdateComponent>;
    let service: OperationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OperationUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(OperationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OperationUpdateComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(OperationService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Operation(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Operation();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackBankAccountById', () => {
        it('Should return tracked BankAccount primary key', () => {
          const entity = new BankAccount(123);
          const trackResult = comp.trackBankAccountById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackLabelById', () => {
        it('Should return tracked Label primary key', () => {
          const entity = new Label(123);
          const trackResult = comp.trackLabelById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedLabel', () => {
        it('Should return option if no Label is selected', () => {
          const option = new Label(123);
          const result = comp.getSelectedLabel(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Label for according option', () => {
          const option = new Label(123);
          const selected = new Label(123);
          const selected2 = new Label(456);
          const result = comp.getSelectedLabel(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Label is not selected', () => {
          const option = new Label(123);
          const selected = new Label(456);
          const result = comp.getSelectedLabel(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
