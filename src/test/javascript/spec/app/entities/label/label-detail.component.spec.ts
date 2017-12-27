/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { JhipsterSampleApplicationTestModule } from '../../../test.module';
import { LabelDetailComponent } from '../../../../../../main/webapp/app/entities/label/label-detail.component';
import { LabelService } from '../../../../../../main/webapp/app/entities/label/label.service';
import { Label } from '../../../../../../main/webapp/app/entities/label/label.model';

describe('Component Tests', () => {

    describe('Label Management Detail Component', () => {
        let comp: LabelDetailComponent;
        let fixture: ComponentFixture<LabelDetailComponent>;
        let service: LabelService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [JhipsterSampleApplicationTestModule],
                declarations: [LabelDetailComponent],
                providers: [
                    LabelService
                ]
            })
            .overrideTemplate(LabelDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(LabelDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LabelService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Label(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.label).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
