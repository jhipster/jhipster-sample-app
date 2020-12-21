import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Label } from '../label.model';

import { LabelDetailComponent } from './label-detail.component';

describe('Component Tests', () => {
  describe('Label Management Detail Component', () => {
    let comp: LabelDetailComponent;
    let fixture: ComponentFixture<LabelDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [LabelDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ label: new Label(123) }) },
          },
        ],
      })
        .overrideTemplate(LabelDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LabelDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load label on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.label).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
