/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { JhipsterSampleApplicationTestModule } from '../../../test.module';
import { BankAccountDetailComponent } from '../../../../../../main/webapp/app/entities/bank-account/bank-account-detail.component';
import { BankAccountService } from '../../../../../../main/webapp/app/entities/bank-account/bank-account.service';
import { BankAccount } from '../../../../../../main/webapp/app/entities/bank-account/bank-account.model';

describe('Component Tests', () => {

    describe('BankAccount Management Detail Component', () => {
        let comp: BankAccountDetailComponent;
        let fixture: ComponentFixture<BankAccountDetailComponent>;
        let service: BankAccountService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [JhipsterSampleApplicationTestModule],
                declarations: [BankAccountDetailComponent],
                providers: [
                    BankAccountService
                ]
            })
            .overrideTemplate(BankAccountDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(BankAccountDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BankAccountService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new BankAccount(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.bankAccount).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
