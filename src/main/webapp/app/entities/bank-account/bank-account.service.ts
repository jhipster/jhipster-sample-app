import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IBankAccount } from 'app/shared/model/bank-account.model';

type EntityResponseType = HttpResponse<IBankAccount>;
type EntityArrayResponseType = HttpResponse<IBankAccount[]>;

@Injectable({ providedIn: 'root' })
export class BankAccountService {
  public resourceUrl = SERVER_API_URL + 'api/bank-accounts';

  constructor(protected http: HttpClient) {}

  create(bankAccount: IBankAccount): Observable<EntityResponseType> {
    return this.http.post<IBankAccount>(this.resourceUrl, bankAccount, { observe: 'response' });
  }

  update(bankAccount: IBankAccount): Observable<EntityResponseType> {
    return this.http.put<IBankAccount>(this.resourceUrl, bankAccount, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBankAccount>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBankAccount[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
