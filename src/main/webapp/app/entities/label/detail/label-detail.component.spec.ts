import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LabelDetailComponent } from './label-detail.component';

describe('Label Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: LabelDetailComponent,
              resolve: { label: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(LabelDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load label on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', LabelDetailComponent);

      // THEN
      expect(instance.label).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
