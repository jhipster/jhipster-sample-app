import dayjs from 'dayjs/esm';

import { IOperation, NewOperation } from './operation.model';

export const sampleWithRequiredData: IOperation = {
  id: 3132,
  date: dayjs('2015-08-04T15:11'),
  amount: 5301.66,
};

export const sampleWithPartialData: IOperation = {
  id: 26573,
  date: dayjs('2015-08-05T06:26'),
  description: 'on frilly',
  amount: 26775.88,
};

export const sampleWithFullData: IOperation = {
  id: 6130,
  date: dayjs('2015-08-04T17:27'),
  description: 'toward monumental gape',
  amount: 10799.47,
};

export const sampleWithNewData: NewOperation = {
  date: dayjs('2015-08-04T18:06'),
  amount: 4605.07,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
