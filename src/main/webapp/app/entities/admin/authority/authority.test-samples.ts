import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: 'b2ab9320-81ac-4145-848d-e2a4ad70c961',
};

export const sampleWithPartialData: IAuthority = {
  name: 'd703ab7b-7676-4114-9099-9650dfc2326a',
};

export const sampleWithFullData: IAuthority = {
  name: '7bd0e096-d346-4e39-ae5a-387bdbdb3cb5',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
