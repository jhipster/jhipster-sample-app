import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IUser } from '../user.model';

@Injectable()
export class UsersService {
  readonly usersParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(undefined);
  readonly usersResource = httpResource<IUser[]>(() => {
    const params = this.usersParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of user that have been fetched. It is updated when the usersResource emits a new value.
   * In case of error while fetching the users, the signal is set to an empty array.
   */
  readonly users = computed(() => (this.usersResource.hasValue() ? this.usersResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/users');
}

@Injectable({ providedIn: 'root' })
export class UserService extends UsersService {
  protected readonly http = inject(HttpClient);

  find(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<IUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  getUserIdentifier(user: Pick<IUser, 'id'>): number {
    return user.id;
  }

  compareUser(o1: Pick<IUser, 'id'> | null, o2: Pick<IUser, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserIdentifier(o1) === this.getUserIdentifier(o2) : o1 === o2;
  }

  addUserToCollectionIfMissing<Type extends Pick<IUser, 'id'>>(
    userCollection: Type[],
    ...usersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const users: Type[] = usersToCheck.filter(isPresent);
    if (users.length > 0) {
      const userCollectionIdentifiers = userCollection.map(userItem => this.getUserIdentifier(userItem));
      const usersToAdd = users.filter(userItem => {
        const userIdentifier = this.getUserIdentifier(userItem);
        if (userCollectionIdentifiers.includes(userIdentifier)) {
          return false;
        }
        userCollectionIdentifiers.push(userIdentifier);
        return true;
      });
      return [...usersToAdd, ...userCollection];
    }
    return userCollection;
  }
}
