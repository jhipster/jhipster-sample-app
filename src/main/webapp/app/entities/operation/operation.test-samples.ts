import dayjs from 'dayjs/esm';

import { IOperation, NewOperation } from './operation.model';

export const sampleWithRequiredData: IOperation = {
  id: 32808,
  date: dayjs('2015-08-04T13:39'),
  amount: 59920,
};

export const sampleWithPartialData: IOperation = {
  id: 93885,
  date: dayjs('2015-08-05T02:21'),
  amount: 35911,
};

export const sampleWithFullData: IOperation = {
  id: 98454,
  date: dayjs('2015-08-05T07:49'),
  description: 'pixel Analyst Palestinian',
  amount: 65185,
};

export const sampleWithNewData: NewOperation = {
  date: dayjs('2015-08-05T06:32'),
  amount: 65291,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
