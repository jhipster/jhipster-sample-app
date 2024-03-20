import { IBankAccount, NewBankAccount } from './bank-account.model';

export const sampleWithRequiredData: IBankAccount = {
  id: 362,
  name: 'repress considering playfully',
  balance: 6428.55,
};

export const sampleWithPartialData: IBankAccount = {
  id: 8547,
  name: 'that enormous leveret',
  balance: 22512.49,
};

export const sampleWithFullData: IBankAccount = {
  id: 11188,
  name: 'doubt huzzah',
  balance: 16097.63,
};

export const sampleWithNewData: NewBankAccount = {
  name: 'likely apud uh-huh',
  balance: 12440.4,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
