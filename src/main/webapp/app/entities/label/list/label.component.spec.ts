import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LabelService } from '../service/label.service';

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

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.labels?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
