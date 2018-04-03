import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ILabel } from 'app/shared/model/label.model';

export type EntityResponseType = HttpResponse<ILabel>;
export type EntityArrayResponseType = HttpResponse<ILabel[]>;

@Injectable()
export class LabelService {
  private resourceUrl = SERVER_API_URL + 'api/labels';

  constructor(private http: HttpClient) {}

  create(label: ILabel): Observable<EntityResponseType> {
    const copy = this.convert(label);
    return this.http
      .post<ILabel>(this.resourceUrl, copy, { observe: 'response' })
      .map((res: EntityResponseType) => this.convertResponse(res));
  }

  update(label: ILabel): Observable<EntityResponseType> {
    const copy = this.convert(label);
    return this.http
      .put<ILabel>(this.resourceUrl, copy, { observe: 'response' })
      .map((res: EntityResponseType) => this.convertResponse(res));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ILabel>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .map((res: EntityResponseType) => this.convertResponse(res));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILabel[]>(this.resourceUrl, { params: options, observe: 'response' })
      .map((res: EntityArrayResponseType) => this.convertArrayResponse(res));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  private convertResponse(res: EntityResponseType): EntityResponseType {
    const body: ILabel = this.convertItemFromServer(res.body);
    return res.clone({ body });
  }

  private convertArrayResponse(res: EntityArrayResponseType): EntityArrayResponseType {
    const jsonResponse: ILabel[] = res.body;
    const body: ILabel[] = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      body.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return res.clone({ body });
  }

  /**
   * Convert a returned JSON object to Label.
   */
  private convertItemFromServer(label: ILabel): ILabel {
    const copy: ILabel = Object.assign({}, label, {});
    return copy;
  }

  /**
   * Convert a Label to a JSON which can be sent to the server.
   */
  private convert(label: ILabel): ILabel {
    const copy: ILabel = Object.assign({}, label, {});
    return copy;
  }
}
