import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IBankAccount } from 'app/shared/model/bank-account.model';

export type EntityResponseType = HttpResponse<IBankAccount>;
export type EntityArrayResponseType = HttpResponse<IBankAccount[]>;

@Injectable()
export class BankAccountService {
  private resourceUrl = SERVER_API_URL + 'api/bank-accounts';

  constructor(private http: HttpClient) {}

  create(bankAccount: IBankAccount): Observable<EntityResponseType> {
    const copy = this.convert(bankAccount);
    return this.http
      .post<IBankAccount>(this.resourceUrl, copy, { observe: 'response' })
      .map((res: EntityResponseType) => this.convertResponse(res));
  }

  update(bankAccount: IBankAccount): Observable<EntityResponseType> {
    const copy = this.convert(bankAccount);
    return this.http
      .put<IBankAccount>(this.resourceUrl, copy, { observe: 'response' })
      .map((res: EntityResponseType) => this.convertResponse(res));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBankAccount>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .map((res: EntityResponseType) => this.convertResponse(res));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBankAccount[]>(this.resourceUrl, { params: options, observe: 'response' })
      .map((res: EntityArrayResponseType) => this.convertArrayResponse(res));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  private convertResponse(res: EntityResponseType): EntityResponseType {
    const body: IBankAccount = this.convertItemFromServer(res.body);
    return res.clone({ body });
  }

  private convertArrayResponse(res: EntityArrayResponseType): EntityArrayResponseType {
    const jsonResponse: IBankAccount[] = res.body;
    const body: IBankAccount[] = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      body.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return res.clone({ body });
  }

  /**
   * Convert a returned JSON object to BankAccount.
   */
  private convertItemFromServer(bankAccount: IBankAccount): IBankAccount {
    const copy: IBankAccount = Object.assign({}, bankAccount, {});
    return copy;
  }

  /**
   * Convert a BankAccount to a JSON which can be sent to the server.
   */
  private convert(bankAccount: IBankAccount): IBankAccount {
    const copy: IBankAccount = Object.assign({}, bankAccount, {});
    return copy;
  }
}
