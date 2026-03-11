import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { ILabel, NewLabel } from '../label.model';

export type PartialUpdateLabel = Partial<ILabel> & Pick<ILabel, 'id'>;

@Injectable()
export class LabelsService {
  readonly labelsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(undefined);
  readonly labelsResource = httpResource<ILabel[]>(() => {
    const params = this.labelsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of label that have been fetched. It is updated when the labelsResource emits a new value.
   * In case of error while fetching the labels, the signal is set to an empty array.
   */
  readonly labels = computed(() => (this.labelsResource.hasValue() ? this.labelsResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/labels');
}

@Injectable({ providedIn: 'root' })
export class LabelService extends LabelsService {
  protected readonly http = inject(HttpClient);

  create(label: NewLabel): Observable<ILabel> {
    return this.http.post<ILabel>(this.resourceUrl, label);
  }

  update(label: ILabel): Observable<ILabel> {
    return this.http.put<ILabel>(`${this.resourceUrl}/${encodeURIComponent(this.getLabelIdentifier(label))}`, label);
  }

  partialUpdate(label: PartialUpdateLabel): Observable<ILabel> {
    return this.http.patch<ILabel>(`${this.resourceUrl}/${encodeURIComponent(this.getLabelIdentifier(label))}`, label);
  }

  find(id: number): Observable<ILabel> {
    return this.http.get<ILabel>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<ILabel[]>> {
    const options = createRequestOption(req);
    return this.http.get<ILabel[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
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
      const labelCollectionIdentifiers = labelCollection.map(labelItem => this.getLabelIdentifier(labelItem));
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
