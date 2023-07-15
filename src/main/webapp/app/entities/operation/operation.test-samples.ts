import dayjs from 'dayjs/esm';

import { IOperation, NewOperation } from './operation.model';

export const sampleWithRequiredData: IOperation = {
  id: 52177,
  date: dayjs('2015-08-05T05:46'),
  amount: 1548,
};

export const sampleWithPartialData: IOperation = {
  id: 85211,
  date: dayjs('2015-08-05T10:26'),
  amount: 15030,
};

export const sampleWithFullData: IOperation = {
  id: 35074,
  date: dayjs('2015-08-05T08:45'),
  description: 'female',
  amount: 70233,
};

export const sampleWithNewData: NewOperation = {
  date: dayjs('2015-08-05T08:57'),
  amount: 94462,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
