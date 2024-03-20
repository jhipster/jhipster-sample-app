import { ILabel, NewLabel } from './label.model';

export const sampleWithRequiredData: ILabel = {
  id: 12930,
  label: 'interestingly wound wave',
};

export const sampleWithPartialData: ILabel = {
  id: 14220,
  label: 'spin',
};

export const sampleWithFullData: ILabel = {
  id: 21802,
  label: 'agile',
};

export const sampleWithNewData: NewLabel = {
  label: 'mid',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
