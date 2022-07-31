import { ILabel, NewLabel } from './label.model';

export const sampleWithRequiredData: ILabel = {
  id: 60049,
  label: 'Iraq deploy Berkshire',
};

export const sampleWithPartialData: ILabel = {
  id: 75330,
  label: 'XML',
};

export const sampleWithFullData: ILabel = {
  id: 80655,
  label: 'EXE Arizona teal',
};

export const sampleWithNewData: NewLabel = {
  label: 'RSS functionalities violet',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
