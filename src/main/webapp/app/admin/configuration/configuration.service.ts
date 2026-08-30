import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';

import { Observable, map } from 'rxjs';

import { serverApiUrl } from 'app/config';

import { Bean, Beans, ConfigProps, Env, PropertySource } from './configuration.model';

@Service()
export class ConfigurationService {
  private readonly http = inject(HttpClient);

  getBeans(): Observable<Bean[]> {
    return this.http.get<ConfigProps>(`${serverApiUrl}management/configprops`).pipe(
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
    return this.http.get<Env>(`${serverApiUrl}management/env`).pipe(map(env => env.propertySources));
  }
}
