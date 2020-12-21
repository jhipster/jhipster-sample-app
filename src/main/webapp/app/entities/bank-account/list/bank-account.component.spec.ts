import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BankAccountService } from '../service/bank-account.service';
import { BankAccount } from '../bank-account.model';

import { BankAccountComponent } from './bank-account.component';

describe('Component Tests', () => {
  describe('BankAccount Management Component', () => {
    let comp: BankAccountComponent;
    let fixture: ComponentFixture<BankAccountComponent>;
    let service: BankAccountService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BankAccountComponent],
      })
        .overrideTemplate(BankAccountComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BankAccountComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BankAccountService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new BankAccount(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.bankAccounts?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
