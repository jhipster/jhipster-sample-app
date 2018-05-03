/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { JhipsterSampleApplicationTestModule } from '../../../test.module';
import { OperationUpdateComponent } from 'app/entities/operation/operation-update.component';
import { OperationService } from 'app/entities/operation/operation.service';
import { Operation } from 'app/shared/model/operation.model';

import { BankAccountService } from 'app/entities/bank-account';
import { LabelService } from 'app/entities/label';

describe('Component Tests', () => {
    describe('Operation Management Update Component', () => {
        let comp: OperationUpdateComponent;
        let fixture: ComponentFixture<OperationUpdateComponent>;
        let service: OperationService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [JhipsterSampleApplicationTestModule],
                declarations: [OperationUpdateComponent],
                providers: [BankAccountService, LabelService, OperationService]
            })
                .overrideTemplate(OperationUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(OperationUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OperationService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Operation(123);
                    spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({ body: entity })));
                    comp.operation = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Operation();
                    spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({ body: entity })));
                    comp.operation = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
