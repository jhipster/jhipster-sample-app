import { ILabel, NewLabel } from './label.model';

export const sampleWithRequiredData: ILabel = {
  id: 3315,
  label: 'Designer',
};

export const sampleWithPartialData: ILabel = {
  id: 28734,
  label: 'Tools purple Lead',
};

export const sampleWithFullData: ILabel = {
  id: 12754,
  label: 'Bicycle',
};

export const sampleWithNewData: NewLabel = {
  label: 'magenta Progressive',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
