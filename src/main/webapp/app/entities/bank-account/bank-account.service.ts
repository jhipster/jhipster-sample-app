import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { BankAccount } from './bank-account.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<BankAccount>;

@Injectable()
export class BankAccountService {

    private resourceUrl =  SERVER_API_URL + 'api/bank-accounts';

    constructor(private http: HttpClient) { }

    create(bankAccount: BankAccount): Observable<EntityResponseType> {
        const copy = this.convert(bankAccount);
        return this.http.post<BankAccount>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(bankAccount: BankAccount): Observable<EntityResponseType> {
        const copy = this.convert(bankAccount);
        return this.http.put<BankAccount>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<BankAccount>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<BankAccount[]>> {
        const options = createRequestOption(req);
        return this.http.get<BankAccount[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<BankAccount[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: BankAccount = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<BankAccount[]>): HttpResponse<BankAccount[]> {
        const jsonResponse: BankAccount[] = res.body;
        const body: BankAccount[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to BankAccount.
     */
    private convertItemFromServer(bankAccount: BankAccount): BankAccount {
        const copy: BankAccount = Object.assign({}, bankAccount);
        return copy;
    }

    /**
     * Convert a BankAccount to a JSON which can be sent to the server.
     */
    private convert(bankAccount: BankAccount): BankAccount {
        const copy: BankAccount = Object.assign({}, bankAccount);
        return copy;
    }
}
