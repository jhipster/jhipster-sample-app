import { IBankAccount, NewBankAccount } from './bank-account.model';

export const sampleWithRequiredData: IBankAccount = {
  id: 17167,
  name: 'um via',
  balance: 2293.59,
};

export const sampleWithPartialData: IBankAccount = {
  id: 18934,
  name: 'bright whenever',
  balance: 7939.53,
};

export const sampleWithFullData: IBankAccount = {
  id: 13483,
  name: 'gigantic',
  balance: 26580.31,
};

export const sampleWithNewData: NewBankAccount = {
  name: 'clonk porter',
  balance: 26302.97,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
