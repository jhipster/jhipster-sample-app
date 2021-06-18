import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILabel, getLabelIdentifier } from '../label.model';

export type EntityResponseType = HttpResponse<ILabel>;
export type EntityArrayResponseType = HttpResponse<ILabel[]>;

@Injectable({ providedIn: 'root' })
export class LabelService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/labels');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(label: ILabel): Observable<EntityResponseType> {
    return this.http.post<ILabel>(this.resourceUrl, label, { observe: 'response' });
  }

  update(label: ILabel): Observable<EntityResponseType> {
    return this.http.put<ILabel>(`${this.resourceUrl}/${getLabelIdentifier(label) as number}`, label, { observe: 'response' });
  }

  partialUpdate(label: ILabel): Observable<EntityResponseType> {
    return this.http.patch<ILabel>(`${this.resourceUrl}/${getLabelIdentifier(label) as number}`, label, { observe: 'response' });
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

  addLabelToCollectionIfMissing(labelCollection: ILabel[], ...labelsToCheck: (ILabel | null | undefined)[]): ILabel[] {
    const labels: ILabel[] = labelsToCheck.filter(isPresent);
    if (labels.length > 0) {
      const labelCollectionIdentifiers = labelCollection.map(labelItem => getLabelIdentifier(labelItem)!);
      const labelsToAdd = labels.filter(labelItem => {
        const labelIdentifier = getLabelIdentifier(labelItem);
        if (labelIdentifier == null || labelCollectionIdentifiers.includes(labelIdentifier)) {
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
