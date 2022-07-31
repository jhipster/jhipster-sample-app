import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBankAccount, NewBankAccount } from '../bank-account.model';

export type PartialUpdateBankAccount = Partial<IBankAccount> & Pick<IBankAccount, 'id'>;

export type EntityResponseType = HttpResponse<IBankAccount>;
export type EntityArrayResponseType = HttpResponse<IBankAccount[]>;

@Injectable({ providedIn: 'root' })
export class BankAccountService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bank-accounts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bankAccount: NewBankAccount): Observable<EntityResponseType> {
    return this.http.post<IBankAccount>(this.resourceUrl, bankAccount, { observe: 'response' });
  }

  update(bankAccount: IBankAccount): Observable<EntityResponseType> {
    return this.http.put<IBankAccount>(`${this.resourceUrl}/${this.getBankAccountIdentifier(bankAccount)}`, bankAccount, {
      observe: 'response',
    });
  }

  partialUpdate(bankAccount: PartialUpdateBankAccount): Observable<EntityResponseType> {
    return this.http.patch<IBankAccount>(`${this.resourceUrl}/${this.getBankAccountIdentifier(bankAccount)}`, bankAccount, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBankAccount>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBankAccount[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
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
      const bankAccountCollectionIdentifiers = bankAccountCollection.map(
        bankAccountItem => this.getBankAccountIdentifier(bankAccountItem)!
      );
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
