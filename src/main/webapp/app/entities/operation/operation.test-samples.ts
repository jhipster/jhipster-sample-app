import dayjs from 'dayjs/esm';

import { IOperation, NewOperation } from './operation.model';

export const sampleWithRequiredData: IOperation = {
  id: 17097,
  date: dayjs('2015-08-05T05:46'),
  amount: 507.48,
};

export const sampleWithPartialData: IOperation = {
  id: 27922,
  date: dayjs('2015-08-05T10:26'),
  description: 'huzzah',
  amount: 30952.43,
};

export const sampleWithFullData: IOperation = {
  id: 5049,
  date: dayjs('2015-08-04T15:22'),
  description: 'than arithmetic ah',
  amount: 7644.88,
};

export const sampleWithNewData: NewOperation = {
  date: dayjs('2015-08-04T17:07'),
  amount: 18820.14,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
