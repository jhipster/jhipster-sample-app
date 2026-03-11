import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IAuthority, NewAuthority } from '../authority.model';

@Injectable()
export class AuthoritiesService {
  readonly authoritiesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly authoritiesResource = httpResource<IAuthority[]>(() => {
    const params = this.authoritiesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of authority that have been fetched. It is updated when the authoritiesResource emits a new value.
   * In case of error while fetching the authorities, the signal is set to an empty array.
   */
  readonly authorities = computed(() => (this.authoritiesResource.hasValue() ? this.authoritiesResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/authorities');
}

@Injectable({ providedIn: 'root' })
export class AuthorityService extends AuthoritiesService {
  protected readonly http = inject(HttpClient);

  create(authority: NewAuthority): Observable<IAuthority> {
    return this.http.post<IAuthority>(this.resourceUrl, authority);
  }

  find(name: string): Observable<IAuthority> {
    return this.http.get<IAuthority>(`${this.resourceUrl}/${encodeURIComponent(name)}`);
  }

  query(req?: any): Observable<HttpResponse<IAuthority[]>> {
    const options = createRequestOption(req);
    return this.http.get<IAuthority[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(name: string): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(name)}`);
  }

  getAuthorityIdentifier(authority: Pick<IAuthority, 'name'>): string {
    return authority.name;
  }

  compareAuthority(o1: Pick<IAuthority, 'name'> | null, o2: Pick<IAuthority, 'name'> | null): boolean {
    return o1 && o2 ? this.getAuthorityIdentifier(o1) === this.getAuthorityIdentifier(o2) : o1 === o2;
  }

  addAuthorityToCollectionIfMissing<Type extends Pick<IAuthority, 'name'>>(
    authorityCollection: Type[],
    ...authoritiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const authorities: Type[] = authoritiesToCheck.filter(isPresent);
    if (authorities.length > 0) {
      const authorityCollectionIdentifiers = authorityCollection.map(authorityItem => this.getAuthorityIdentifier(authorityItem));
      const authoritiesToAdd = authorities.filter(authorityItem => {
        const authorityIdentifier = this.getAuthorityIdentifier(authorityItem);
        if (authorityCollectionIdentifiers.includes(authorityIdentifier)) {
          return false;
        }
        authorityCollectionIdentifiers.push(authorityIdentifier);
        return true;
      });
      return [...authoritiesToAdd, ...authorityCollection];
    }
    return authorityCollection;
  }
}
