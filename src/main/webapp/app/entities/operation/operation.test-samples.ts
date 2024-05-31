import dayjs from 'dayjs/esm';

import { IOperation, NewOperation } from './operation.model';

export const sampleWithRequiredData: IOperation = {
  id: 8055,
  date: dayjs('2015-08-04T16:23'),
  amount: 3284.82,
};

export const sampleWithPartialData: IOperation = {
  id: 11493,
  date: dayjs('2015-08-05T08:45'),
  description: 'usefully',
  amount: 26572.51,
};

export const sampleWithFullData: IOperation = {
  id: 23559,
  date: dayjs('2015-08-04T19:15'),
  description: 'promptly envy so',
  amount: 25068.34,
};

export const sampleWithNewData: NewOperation = {
  date: dayjs('2015-08-05T03:42'),
  amount: 9171.56,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
