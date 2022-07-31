import { IBankAccount, NewBankAccount } from './bank-account.model';

export const sampleWithRequiredData: IBankAccount = {
  id: 9495,
  name: 'South',
  balance: 81250,
};

export const sampleWithPartialData: IBankAccount = {
  id: 39856,
  name: 'next-generation orchid',
  balance: 14310,
};

export const sampleWithFullData: IBankAccount = {
  id: 84747,
  name: 'port Communications Configurable',
  balance: 75593,
};

export const sampleWithNewData: NewBankAccount = {
  name: 'open-source',
  balance: 96021,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
