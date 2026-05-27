import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 24814,
  login: 'Mac36',
};

export const sampleWithPartialData: IUser = {
  id: 966,
  login: 'Isaac_Senger',
};

export const sampleWithFullData: IUser = {
  id: 5440,
  login: 'Ken.Dietrich20',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
