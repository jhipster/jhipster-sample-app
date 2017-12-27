/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { JhipsterSampleApplicationTestModule } from '../../../test.module';
import { LabelDialogComponent } from '../../../../../../main/webapp/app/entities/label/label-dialog.component';
import { LabelService } from '../../../../../../main/webapp/app/entities/label/label.service';
import { Label } from '../../../../../../main/webapp/app/entities/label/label.model';
import { OperationService } from '../../../../../../main/webapp/app/entities/operation';

describe('Component Tests', () => {

    describe('Label Management Dialog Component', () => {
        let comp: LabelDialogComponent;
        let fixture: ComponentFixture<LabelDialogComponent>;
        let service: LabelService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [JhipsterSampleApplicationTestModule],
                declarations: [LabelDialogComponent],
                providers: [
                    OperationService,
                    LabelService
                ]
            })
            .overrideTemplate(LabelDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LabelDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LabelService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Label(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.label = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'labelListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Label();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.label = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'labelListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
