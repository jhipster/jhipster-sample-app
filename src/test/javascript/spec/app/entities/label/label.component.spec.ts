/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { JhipsterSampleApplicationTestModule } from '../../../test.module';
import { LabelComponent } from 'app/entities/label/label.component';
import { LabelService } from 'app/entities/label/label.service';
import { Label } from 'app/shared/model/label.model';

describe('Component Tests', () => {
  describe('Label Management Component', () => {
    let comp: LabelComponent;
    let fixture: ComponentFixture<LabelComponent>;
    let service: LabelService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterSampleApplicationTestModule],
        declarations: [LabelComponent],
        providers: []
      })
        .overrideTemplate(LabelComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LabelComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(LabelService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Label(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.labels[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
