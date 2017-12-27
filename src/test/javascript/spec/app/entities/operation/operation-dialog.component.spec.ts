/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { JhipsterSampleApplicationTestModule } from '../../../test.module';
import { OperationDialogComponent } from '../../../../../../main/webapp/app/entities/operation/operation-dialog.component';
import { OperationService } from '../../../../../../main/webapp/app/entities/operation/operation.service';
import { Operation } from '../../../../../../main/webapp/app/entities/operation/operation.model';
import { BankAccountService } from '../../../../../../main/webapp/app/entities/bank-account';
import { LabelService } from '../../../../../../main/webapp/app/entities/label';

describe('Component Tests', () => {

    describe('Operation Management Dialog Component', () => {
        let comp: OperationDialogComponent;
        let fixture: ComponentFixture<OperationDialogComponent>;
        let service: OperationService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [JhipsterSampleApplicationTestModule],
                declarations: [OperationDialogComponent],
                providers: [
                    BankAccountService,
                    LabelService,
                    OperationService
                ]
            })
            .overrideTemplate(OperationDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OperationDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OperationService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Operation(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.operation = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'operationListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Operation();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.operation = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'operationListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
