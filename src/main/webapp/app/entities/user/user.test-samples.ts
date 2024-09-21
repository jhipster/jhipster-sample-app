import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 9396,
  login: 'J',
};

export const sampleWithPartialData: IUser = {
  id: 27505,
  login: '9@HOS7yd\\|7x\\dfnOG\\;WhQqj\\VW',
};

export const sampleWithFullData: IUser = {
  id: 21232,
  login: '5E^`@Ng\\dSXe0Nl\\XgXrbIM\\G2bOR5x\\%XmaVQ',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
