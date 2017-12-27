/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { JhipsterSampleApplicationTestModule } from '../../../test.module';
import { OperationComponent } from '../../../../../../main/webapp/app/entities/operation/operation.component';
import { OperationService } from '../../../../../../main/webapp/app/entities/operation/operation.service';
import { Operation } from '../../../../../../main/webapp/app/entities/operation/operation.model';

describe('Component Tests', () => {

    describe('Operation Management Component', () => {
        let comp: OperationComponent;
        let fixture: ComponentFixture<OperationComponent>;
        let service: OperationService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [JhipsterSampleApplicationTestModule],
                declarations: [OperationComponent],
                providers: [
                    OperationService
                ]
            })
            .overrideTemplate(OperationComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OperationComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OperationService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Operation(123)],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.operations[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
