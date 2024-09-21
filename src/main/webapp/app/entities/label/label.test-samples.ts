import { ILabel, NewLabel } from './label.model';

export const sampleWithRequiredData: ILabel = {
  id: 8296,
  label: 'heighten alongside',
};

export const sampleWithPartialData: ILabel = {
  id: 23246,
  label: 'haX',
};

export const sampleWithFullData: ILabel = {
  id: 10945,
  label: 'yet bruised',
};

export const sampleWithNewData: NewLabel = {
  label: 'aboard intelligent gentle',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
