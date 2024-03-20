import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: 'b3700b3c-0da9-4a58-b524-bc34f51d2324',
};

export const sampleWithPartialData: IAuthority = {
  name: 'c76ca8f4-38e0-4c20-8ec1-59f576c54d2d',
};

export const sampleWithFullData: IAuthority = {
  name: '550f6642-b211-4a47-a177-e77193935c4d',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
