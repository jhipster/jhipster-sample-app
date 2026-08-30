import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { serverApiUrl } from 'app/config';
import { createRequestOption } from 'app/core/request';
import { IUserManagement, NewUserManagement } from '../user-management.model';

export type PartialUpdateUserManagement = Partial<IUserManagement> & Pick<IUserManagement, 'login'>;

type RestOf<T extends IUserManagement | NewUserManagement> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestUserManagement = RestOf<IUserManagement>;

export type NewRestUserManagement = RestOf<NewUserManagement>;

export type PartialUpdateRestUserManagement = RestOf<PartialUpdateUserManagement>;

@Service()
export class UserManagementsService {
  readonly userManagementsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly userManagementsResource = httpResource<RestUserManagement[]>(() => {
    const params = this.userManagementsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of userManagement that have been fetched. It is updated when the userManagementsResource emits a new value.
   * In case of error while fetching the userManagements, the signal is set to an empty array.
   */
  readonly userManagements = computed(() =>
    (this.userManagementsResource.hasValue() ? this.userManagementsResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly resourceUrl = `${serverApiUrl}api/admin/users`;

  protected convertValueFromServer(restUserManagement: RestUserManagement): IUserManagement {
    return {
      ...restUserManagement,
      createdDate: restUserManagement.createdDate ? dayjs(restUserManagement.createdDate) : undefined,
      lastModifiedDate: restUserManagement.lastModifiedDate ? dayjs(restUserManagement.lastModifiedDate) : undefined,
    };
  }
}

@Service()
export class UserManagementService extends UserManagementsService {
  protected readonly http = inject(HttpClient);

  create(userManagement: NewUserManagement): Observable<IUserManagement> {
    const copy = this.convertValueFromClient(userManagement);
    return this.http.post<RestUserManagement>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(userManagement: IUserManagement): Observable<IUserManagement> {
    const copy = this.convertValueFromClient(userManagement);
    return this.http
      .put<RestUserManagement>(`${this.resourceUrl}/${encodeURIComponent(this.getUserManagementIdentifier(userManagement))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(userManagement: PartialUpdateUserManagement): Observable<IUserManagement> {
    const copy = this.convertValueFromClient(userManagement);
    return this.http
      .patch<RestUserManagement>(`${this.resourceUrl}/${encodeURIComponent(this.getUserManagementIdentifier(userManagement))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(login: string): Observable<IUserManagement> {
    return this.http
      .get<RestUserManagement>(`${this.resourceUrl}/${encodeURIComponent(login)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IUserManagement[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestUserManagement[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(login: string): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(login)}`);
  }

  getUserManagementIdentifier(userManagement: Pick<IUserManagement, 'login'>): string {
    return userManagement.login;
  }

  compareUserManagement(o1: Pick<IUserManagement, 'login'> | null, o2: Pick<IUserManagement, 'login'> | null): boolean {
    return o1 && o2 ? this.getUserManagementIdentifier(o1) === this.getUserManagementIdentifier(o2) : o1 === o2;
  }

  addUserManagementToCollectionIfMissing<Type extends Pick<IUserManagement, 'login'>>(
    userManagementCollection: Type[],
    ...userManagementsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userManagements: Type[] = userManagementsToCheck.filter(
      userManagementItem => userManagementItem !== null && userManagementItem !== undefined,
    );
    if (userManagements.length > 0) {
      const userManagementCollectionIdentifiers = userManagementCollection.map(userManagementItem =>
        this.getUserManagementIdentifier(userManagementItem),
      );
      const userManagementsToAdd = userManagements.filter(userManagementItem => {
        const userManagementIdentifier = this.getUserManagementIdentifier(userManagementItem);
        if (userManagementCollectionIdentifiers.includes(userManagementIdentifier)) {
          return false;
        }
        userManagementCollectionIdentifiers.push(userManagementIdentifier);
        return true;
      });
      return [...userManagementsToAdd, ...userManagementCollection];
    }
    return userManagementCollection;
  }

  protected convertValueFromClient<T extends IUserManagement | NewUserManagement | PartialUpdateUserManagement>(
    userManagement: T,
  ): RestOf<T> {
    return {
      ...userManagement,
      createdDate: userManagement.createdDate?.toJSON() ?? null,
      lastModifiedDate: userManagement.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestUserManagement): IUserManagement {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestUserManagement[]): IUserManagement[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
