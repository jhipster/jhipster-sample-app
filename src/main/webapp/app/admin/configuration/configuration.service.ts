import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

import { Bean, Beans, ConfigProps, Env, PropertySource } from './configuration.model';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  private readonly http = inject(HttpClient);
  private readonly applicationConfigService = inject(ApplicationConfigService);

  getBeans(): Observable<Bean[]> {
    return this.http.get<ConfigProps>(this.applicationConfigService.getEndpointFor('management/configprops')).pipe(
      map(configProps =>
        Object.values(
          Object.values(configProps.contexts)
            .map(context => context.beans)
            .reduce((allBeans: Beans, contextBeans: Beans) => ({ ...allBeans, ...contextBeans }), {}),
        ),
      ),
    );
  }

  getPropertySources(): Observable<PropertySource[]> {
    return this.http.get<Env>(this.applicationConfigService.getEndpointFor('management/env')).pipe(map(env => env.propertySources));
  }
}
