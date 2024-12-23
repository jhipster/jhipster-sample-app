import dayjs from 'dayjs/esm';

import { IOperation, NewOperation } from './operation.model';

export const sampleWithRequiredData: IOperation = {
  id: 6430,
  date: dayjs('2015-08-04T16:53'),
  amount: 11212.28,
};

export const sampleWithPartialData: IOperation = {
  id: 1069,
  date: dayjs('2015-08-05T05:24'),
  description: 'yieldingly than quinoa',
  amount: 2488.45,
};

export const sampleWithFullData: IOperation = {
  id: 13289,
  date: dayjs('2015-08-05T04:43'),
  description: 'yowza',
  amount: 13675.92,
};

export const sampleWithNewData: NewOperation = {
  date: dayjs('2015-08-05T07:27'),
  amount: 5543.31,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
