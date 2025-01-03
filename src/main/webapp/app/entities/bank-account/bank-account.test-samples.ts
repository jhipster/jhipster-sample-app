import { IBankAccount, NewBankAccount } from './bank-account.model';

export const sampleWithRequiredData: IBankAccount = {
  id: 19554,
  name: 'woot mixture who',
  balance: 32045.7,
  country: 'US',
};

export const sampleWithPartialData: IBankAccount = {
  id: 3160,
  name: 'devoted',
  balance: 24340.97,
  country: 'CA',
};

export const sampleWithFullData: IBankAccount = {
  id: 14417,
  name: 'spectacles',
  balance: 15553.03,
  country: 'GB',
};

export const sampleWithNewData: NewBankAccount = {
  name: 'pfft',
  balance: 1165.61,
  country: 'US',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
