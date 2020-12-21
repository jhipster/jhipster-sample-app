import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LogsComponent } from './logs.component';
import { LogsService } from './logs.service';
import { Log } from './log.model';

describe('Component Tests', () => {
  describe('LogsComponent', () => {
    let comp: LogsComponent;
    let fixture: ComponentFixture<LogsComponent>;
    let service: LogsService;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],
          declarations: [LogsComponent],
          providers: [LogsService],
        })
          .overrideTemplate(LogsComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(LogsComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(LogsService);
    });

    describe('OnInit', () => {
      it('should set all default values correctly', () => {
        expect(comp.filter).toBe('');
        expect(comp.orderProp).toBe('name');
        expect(comp.ascending).toBe(true);
      });

      it('Should call load all on init', () => {
        // GIVEN
        const log = new Log('main', 'WARN');
        spyOn(service, 'findAll').and.returnValue(
          of({
            loggers: {
              main: {
                effectiveLevel: 'WARN',
              },
            },
          })
        );

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(service.findAll).toHaveBeenCalled();
        expect(comp.loggers?.[0]).toEqual(jasmine.objectContaining(log));
      });
    });

    describe('change log level', () => {
      it('should change log level correctly', () => {
        // GIVEN
        const log = new Log('main', 'ERROR');
        spyOn(service, 'changeLevel').and.returnValue(of({}));
        spyOn(service, 'findAll').and.returnValue(
          of({
            loggers: {
              main: {
                effectiveLevel: 'ERROR',
              },
            },
          })
        );

        // WHEN
        comp.changeLevel('main', 'ERROR');

        // THEN
        expect(service.changeLevel).toHaveBeenCalled();
        expect(service.findAll).toHaveBeenCalled();
        expect(comp.loggers?.[0]).toEqual(jasmine.objectContaining(log));
      });
    });
  });
});
