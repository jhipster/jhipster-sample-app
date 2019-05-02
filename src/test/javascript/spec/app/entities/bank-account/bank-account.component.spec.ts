/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { JhipsterSampleApplicationTestModule } from '../../../test.module';
import { BankAccountComponent } from 'app/entities/bank-account/bank-account.component';
import { BankAccountService } from 'app/entities/bank-account/bank-account.service';
import { BankAccount } from 'app/shared/model/bank-account.model';

describe('Component Tests', () => {
  describe('BankAccount Management Component', () => {
    let comp: BankAccountComponent;
    let fixture: ComponentFixture<BankAccountComponent>;
    let service: BankAccountService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterSampleApplicationTestModule],
        declarations: [BankAccountComponent],
        providers: []
      })
        .overrideTemplate(BankAccountComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BankAccountComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(BankAccountService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new BankAccount(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.bankAccounts[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
