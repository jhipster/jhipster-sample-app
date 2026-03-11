import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 24814,
  login: 'Mae36',
};

export const sampleWithPartialData: IUser = {
  id: 966,
  login: 'Jacob_Senger',
};

export const sampleWithFullData: IUser = {
  id: 5440,
  login: 'Ken.Dietrich20',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
