import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILabel, NewLabel } from '../label.model';

export type PartialUpdateLabel = Partial<ILabel> & Pick<ILabel, 'id'>;

export type EntityResponseType = HttpResponse<ILabel>;
export type EntityArrayResponseType = HttpResponse<ILabel[]>;

@Injectable({ providedIn: 'root' })
export class LabelService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/labels');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(label: NewLabel): Observable<EntityResponseType> {
    return this.http.post<ILabel>(this.resourceUrl, label, { observe: 'response' });
  }

  update(label: ILabel): Observable<EntityResponseType> {
    return this.http.put<ILabel>(`${this.resourceUrl}/${this.getLabelIdentifier(label)}`, label, { observe: 'response' });
  }

  partialUpdate(label: PartialUpdateLabel): Observable<EntityResponseType> {
    return this.http.patch<ILabel>(`${this.resourceUrl}/${this.getLabelIdentifier(label)}`, label, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILabel>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILabel[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLabelIdentifier(label: Pick<ILabel, 'id'>): number {
    return label.id;
  }

  compareLabel(o1: Pick<ILabel, 'id'> | null, o2: Pick<ILabel, 'id'> | null): boolean {
    return o1 && o2 ? this.getLabelIdentifier(o1) === this.getLabelIdentifier(o2) : o1 === o2;
  }

  addLabelToCollectionIfMissing<Type extends Pick<ILabel, 'id'>>(
    labelCollection: Type[],
    ...labelsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const labels: Type[] = labelsToCheck.filter(isPresent);
    if (labels.length > 0) {
      const labelCollectionIdentifiers = labelCollection.map(labelItem => this.getLabelIdentifier(labelItem)!);
      const labelsToAdd = labels.filter(labelItem => {
        const labelIdentifier = this.getLabelIdentifier(labelItem);
        if (labelCollectionIdentifiers.includes(labelIdentifier)) {
          return false;
        }
        labelCollectionIdentifiers.push(labelIdentifier);
        return true;
      });
      return [...labelsToAdd, ...labelCollection];
    }
    return labelCollection;
  }
}
