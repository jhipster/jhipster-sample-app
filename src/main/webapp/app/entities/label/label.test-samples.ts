import { ILabel, NewLabel } from './label.model';

export const sampleWithRequiredData: ILabel = {
  id: 28258,
  label: 'impressive',
};

export const sampleWithPartialData: ILabel = {
  id: 5331,
  label: 'within helpfully zowie',
};

export const sampleWithFullData: ILabel = {
  id: 11722,
  label: 'gloomy unless sew',
};

export const sampleWithNewData: NewLabel = {
  label: 'scaly save yum',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
