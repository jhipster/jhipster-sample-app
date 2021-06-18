import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OperationDetailComponent } from './operation-detail.component';

describe('Component Tests', () => {
  describe('Operation Management Detail Component', () => {
    let comp: OperationDetailComponent;
    let fixture: ComponentFixture<OperationDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [OperationDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ operation: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(OperationDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OperationDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load operation on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.operation).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
