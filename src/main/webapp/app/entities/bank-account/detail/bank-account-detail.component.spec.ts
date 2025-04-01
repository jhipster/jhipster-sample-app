import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { BankAccountDetailComponent } from './bank-account-detail.component';

describe('BankAccount Management Detail Component', () => {
  let comp: BankAccountDetailComponent;
  let fixture: ComponentFixture<BankAccountDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankAccountDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./bank-account-detail.component').then(m => m.BankAccountDetailComponent),
              resolve: { bankAccount: () => of({ id: 22720 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(BankAccountDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load bankAccount on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', BankAccountDetailComponent);

      // THEN
      expect(instance.bankAccount()).toEqual(expect.objectContaining({ id: 22720 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
