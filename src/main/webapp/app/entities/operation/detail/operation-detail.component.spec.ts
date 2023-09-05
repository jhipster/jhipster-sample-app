import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OperationDetailComponent } from './operation-detail.component';

describe('Operation Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: OperationDetailComponent,
              resolve: { operation: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(OperationDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load operation on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', OperationDetailComponent);

      // THEN
      expect(instance.operation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
