import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { Headers } from '@angular/http';

import { JhipsterSampleApplicationTestModule } from '../../../test.module';
import { Principal } from '../../../../../../main/webapp/app/shared';
import { UserMgmtComponent } from '../../../../../../main/webapp/app/admin/user-management/user-management.component';
import { UserService, User } from '../../../../../../main/webapp/app/shared';

describe('Component Tests', () => {

    describe('User Management Component', () => {
        let comp: UserMgmtComponent;
        let fixture: ComponentFixture<UserMgmtComponent>;
        let service: UserService;
        let mockPrincipal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [JhipsterSampleApplicationTestModule],
                declarations: [UserMgmtComponent],
                providers: [
                    UserService
                ]
            })
            .overrideTemplate(UserMgmtComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(UserMgmtComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UserService);
            mockPrincipal = fixture.debugElement.injector.get(Principal);
        });

        describe('OnInit', () => {
            it('Should call load all on init',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const headers = new Headers();
                        headers.append('link', 'link;link');
                        spyOn(service, 'query').and.returnValue(Observable.of({
                            json: [new User(123)],
                            headers
                        }));

                        // WHEN
                        comp.ngOnInit();
                        tick(); // simulate async

                        // THEN
                        expect(service.query).toHaveBeenCalled();
                        expect(comp.users[0]).toEqual(jasmine.objectContaining({id: 123}));
                    })
                )
            );
        });

        describe('setActive', () => {
            it('Should update user and call load all',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const headers = new Headers();
                        headers.append('link', 'link;link');
                        const user = new User(123);
                        spyOn(service, 'query').and.returnValue(Observable.of({
                            json: [user],
                            headers
                        }));
                        spyOn(service, 'update').and.returnValue(Observable.of({ status: 200 }));

                        // WHEN
                        comp.setActive(user, true);
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(user);
                        expect(service.query).toHaveBeenCalled();
                        expect(comp.users[0]).toEqual(jasmine.objectContaining({id: 123}));
                    })
                )
            );
        });
    });

});
