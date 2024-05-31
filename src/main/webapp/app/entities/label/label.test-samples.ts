import { ILabel, NewLabel } from './label.model';

export const sampleWithRequiredData: ILabel = {
  id: 3315,
  label: 'deceivingly',
};

export const sampleWithPartialData: ILabel = {
  id: 5191,
  label: 'greens lever',
};

export const sampleWithFullData: ILabel = {
  id: 15375,
  label: 'ha imitation',
};

export const sampleWithNewData: NewLabel = {
  label: 'because unto',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
