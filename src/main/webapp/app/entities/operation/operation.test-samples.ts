import dayjs from 'dayjs/esm';

import { IOperation, NewOperation } from './operation.model';

export const sampleWithRequiredData: IOperation = {
  id: 17097,
  date: dayjs('2015-08-05T05:46'),
  amount: 507,
};

export const sampleWithPartialData: IOperation = {
  id: 27922,
  date: dayjs('2015-08-05T10:26'),
  description: 'Southeast',
  amount: 3199,
};

export const sampleWithFullData: IOperation = {
  id: 23014,
  date: dayjs('2015-08-05T08:57'),
  description: 'cyan Gasoline Livermorium',
  amount: 13122,
};

export const sampleWithNewData: NewOperation = {
  date: dayjs('2015-08-05T09:46'),
  amount: 16908,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
