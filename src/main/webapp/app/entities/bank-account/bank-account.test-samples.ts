import { IBankAccount, NewBankAccount } from './bank-account.model';

export const sampleWithRequiredData: IBankAccount = {
  id: 21651,
  name: 'Pop',
  balance: 87485,
};

export const sampleWithPartialData: IBankAccount = {
  id: 2270,
  name: 'radical',
  balance: 33747,
};

export const sampleWithFullData: IBankAccount = {
  id: 29899,
  name: 'Movies Hatchback',
  balance: 64465,
};

export const sampleWithNewData: NewBankAccount = {
  name: 'Dollar',
  balance: 5322,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
