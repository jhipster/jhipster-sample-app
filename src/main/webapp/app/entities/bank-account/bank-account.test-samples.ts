import { IBankAccount, NewBankAccount } from './bank-account.model';

export const sampleWithRequiredData: IBankAccount = {
  id: 7094,
  name: 'woman',
  balance: 744,
};

export const sampleWithPartialData: IBankAccount = {
  id: 8492,
  name: 'Fitness deposit',
  balance: 2195,
};

export const sampleWithFullData: IBankAccount = {
  id: 28147,
  name: 'Future Rupee',
  balance: 1743,
};

export const sampleWithNewData: NewBankAccount = {
  name: 'Bicycle',
  balance: 6523,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
