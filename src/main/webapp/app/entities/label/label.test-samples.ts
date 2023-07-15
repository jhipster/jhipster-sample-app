import { ILabel, NewLabel } from './label.model';

export const sampleWithRequiredData: ILabel = {
  id: 10119,
  label: 'Designer',
};

export const sampleWithPartialData: ILabel = {
  id: 87689,
  label: 'grey Luciano Southwest',
};

export const sampleWithFullData: ILabel = {
  id: 58539,
  label: 'productivity Director Security',
};

export const sampleWithNewData: NewLabel = {
  label: 'Chief resource',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
