import { IBankAccount, NewBankAccount } from './bank-account.model';

export const sampleWithRequiredData: IBankAccount = {
  id: 7094,
  name: 'solemnly',
  balance: 11058.15,
};

export const sampleWithPartialData: IBankAccount = {
  id: 9797,
  name: 'woot er',
  balance: 6523.78,
};

export const sampleWithFullData: IBankAccount = {
  id: 17714,
  name: 'phew',
  balance: 21828.46,
};

export const sampleWithNewData: NewBankAccount = {
  name: 'duh ice',
  balance: 9789.22,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
