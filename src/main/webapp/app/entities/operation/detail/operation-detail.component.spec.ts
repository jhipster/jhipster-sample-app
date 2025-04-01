import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { OperationDetailComponent } from './operation-detail.component';

describe('Operation Management Detail Component', () => {
  let comp: OperationDetailComponent;
  let fixture: ComponentFixture<OperationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./operation-detail.component').then(m => m.OperationDetailComponent),
              resolve: { operation: () => of({ id: 13822 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(OperationDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load operation on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', OperationDetailComponent);

      // THEN
      expect(instance.operation()).toEqual(expect.objectContaining({ id: 13822 }));
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
