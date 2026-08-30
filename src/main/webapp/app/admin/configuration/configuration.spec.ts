import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import Configuration from './configuration';
import { Bean, PropertySource } from './configuration.model';
import { ConfigurationService } from './configuration.service';

describe('Configuration', () => {
  let comp: Configuration;
  let fixture: ComponentFixture<Configuration>;
  let service: ConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigurationService],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Configuration);
    comp = fixture.componentInstance;
    service = TestBed.inject(ConfigurationService);
  });

  describe('OnInit', () => {
    it('should call load all on init', () => {
      // GIVEN
      const beans: Bean[] = [
        {
          prefix: 'jhipster',
          properties: {
            clientApp: {
              name: 'jhipsterApp',
            },
          },
        },
      ];
      const propertySources: PropertySource[] = [
        {
          name: 'server.ports',
          properties: {
            'local.server.port': {
              value: '8080',
            },
          },
        },
      ];
      vi.spyOn(service, 'getBeans').mockReturnValue(of(beans));
      vi.spyOn(service, 'getPropertySources').mockReturnValue(of(propertySources));

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.getBeans).toHaveBeenCalled();
      expect(service.getPropertySources).toHaveBeenCalled();
      expect(comp.allBeans()).toEqual(beans);
      expect(comp.beans()).toEqual(beans);
      expect(comp.propertySources()).toEqual(propertySources);
    });
  });
});
