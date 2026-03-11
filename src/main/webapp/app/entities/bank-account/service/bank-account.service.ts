import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IBankAccount, NewBankAccount } from '../bank-account.model';

export type PartialUpdateBankAccount = Partial<IBankAccount> & Pick<IBankAccount, 'id'>;

@Injectable()
export class BankAccountsService {
  readonly bankAccountsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly bankAccountsResource = httpResource<IBankAccount[]>(() => {
    const params = this.bankAccountsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of bankAccount that have been fetched. It is updated when the bankAccountsResource emits a new value.
   * In case of error while fetching the bankAccounts, the signal is set to an empty array.
   */
  readonly bankAccounts = computed(() => (this.bankAccountsResource.hasValue() ? this.bankAccountsResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/bank-accounts');
}

@Injectable({ providedIn: 'root' })
export class BankAccountService extends BankAccountsService {
  protected readonly http = inject(HttpClient);

  create(bankAccount: NewBankAccount): Observable<IBankAccount> {
    return this.http.post<IBankAccount>(this.resourceUrl, bankAccount);
  }

  update(bankAccount: IBankAccount): Observable<IBankAccount> {
    return this.http.put<IBankAccount>(
      `${this.resourceUrl}/${encodeURIComponent(this.getBankAccountIdentifier(bankAccount))}`,
      bankAccount,
    );
  }

  partialUpdate(bankAccount: PartialUpdateBankAccount): Observable<IBankAccount> {
    return this.http.patch<IBankAccount>(
      `${this.resourceUrl}/${encodeURIComponent(this.getBankAccountIdentifier(bankAccount))}`,
      bankAccount,
    );
  }

  find(id: number): Observable<IBankAccount> {
    return this.http.get<IBankAccount>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<IBankAccount[]>> {
    const options = createRequestOption(req);
    return this.http.get<IBankAccount[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getBankAccountIdentifier(bankAccount: Pick<IBankAccount, 'id'>): number {
    return bankAccount.id;
  }

  compareBankAccount(o1: Pick<IBankAccount, 'id'> | null, o2: Pick<IBankAccount, 'id'> | null): boolean {
    return o1 && o2 ? this.getBankAccountIdentifier(o1) === this.getBankAccountIdentifier(o2) : o1 === o2;
  }

  addBankAccountToCollectionIfMissing<Type extends Pick<IBankAccount, 'id'>>(
    bankAccountCollection: Type[],
    ...bankAccountsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const bankAccounts: Type[] = bankAccountsToCheck.filter(isPresent);
    if (bankAccounts.length > 0) {
      const bankAccountCollectionIdentifiers = bankAccountCollection.map(bankAccountItem => this.getBankAccountIdentifier(bankAccountItem));
      const bankAccountsToAdd = bankAccounts.filter(bankAccountItem => {
        const bankAccountIdentifier = this.getBankAccountIdentifier(bankAccountItem);
        if (bankAccountCollectionIdentifiers.includes(bankAccountIdentifier)) {
          return false;
        }
        bankAccountCollectionIdentifiers.push(bankAccountIdentifier);
        return true;
      });
      return [...bankAccountsToAdd, ...bankAccountCollection];
    }
    return bankAccountCollection;
  }
}
