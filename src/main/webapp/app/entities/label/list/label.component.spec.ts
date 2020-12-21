import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LabelService } from '../service/label.service';
import { Label } from '../label.model';

import { LabelComponent } from './label.component';

describe('Component Tests', () => {
  describe('Label Management Component', () => {
    let comp: LabelComponent;
    let fixture: ComponentFixture<LabelComponent>;
    let service: LabelService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LabelComponent],
      })
        .overrideTemplate(LabelComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LabelComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(LabelService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Label(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.labels?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
