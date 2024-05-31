import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: 'b829a0b1-993c-4200-9281-18a1cf1b455f',
};

export const sampleWithPartialData: IAuthority = {
  name: '587deef2-ca94-4aac-9dd7-500c399681f0',
};

export const sampleWithFullData: IAuthority = {
  name: 'd175073c-a0b2-474b-8172-68756d141f45',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
