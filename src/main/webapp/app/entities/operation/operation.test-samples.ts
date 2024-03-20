import dayjs from 'dayjs/esm';

import { IOperation, NewOperation } from './operation.model';

export const sampleWithRequiredData: IOperation = {
  id: 10963,
  date: dayjs('2015-08-04T15:20'),
  amount: 3283.88,
};

export const sampleWithPartialData: IOperation = {
  id: 25435,
  date: dayjs('2015-08-05T09:29'),
  description: 'bah stickybeak ouch',
  amount: 18017.83,
};

export const sampleWithFullData: IOperation = {
  id: 27253,
  date: dayjs('2015-08-05T03:26'),
  description: 'over',
  amount: 12825.14,
};

export const sampleWithNewData: NewOperation = {
  date: dayjs('2015-08-04T20:26'),
  amount: 23191.97,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
