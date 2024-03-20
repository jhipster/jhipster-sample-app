import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 7665,
  login: 'XsgD',
};

export const sampleWithPartialData: IUser = {
  id: 32722,
  login: '2`{@7f\\&Wq\\4gbOs\\CwDh\\&mr\\5-n',
};

export const sampleWithFullData: IUser = {
  id: 30499,
  login: '-PIP',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
