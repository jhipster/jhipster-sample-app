import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { JhipsterSampleApplicationTestModule } from '../../../test.module';
import { UserMgmtDialogComponent } from '../../../../../../main/webapp/app/admin/user-management/user-management-dialog.component';
import { UserService, User, JhiLanguageHelper } from '../../../../../../main/webapp/app/shared';

describe('Component Tests', () => {

    describe('User Management Dialog Component', () => {
        let comp: UserMgmtDialogComponent;
        let fixture: ComponentFixture<UserMgmtDialogComponent>;
        let service: UserService;
        let mockEventManager: any;
        let mockActiveModal: any;
        let mockLanguageHelper: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [JhipsterSampleApplicationTestModule],
                declarations: [UserMgmtDialogComponent],
                providers: [
                    UserService
                ]
            })
            .overrideTemplate(UserMgmtDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(UserMgmtDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UserService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
            mockLanguageHelper = fixture.debugElement.injector.get(JhiLanguageHelper);
        });

        describe('OnInit', () => {
            it('Should load authorities and language on init',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'authorities').and.returnValue(Observable.of(['USER']));

                        // WHEN
                        comp.ngOnInit();

                        // THEN
                        expect(service.authorities).toHaveBeenCalled();
                        expect(comp.authorities).toEqual(['USER']);
                        expect(mockLanguageHelper.getAllSpy).toHaveBeenCalled();
                    })
                )
            );
        });

        describe('save', () => {
            it('Should call update service on save for existing user',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new User(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.user = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'userListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new user',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new User();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.user = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'userListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
