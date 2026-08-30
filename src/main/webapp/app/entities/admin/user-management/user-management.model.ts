import dayjs from 'dayjs/esm';

import { LANGUAGES } from 'app/config';

export interface IUserManagement {
  id?: number | null;
  login: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  activated?: boolean | null;
  langKey?: (typeof LANGUAGES)[number] | null;
  imageUrl?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  authorities?: string[] | null;
}

export type NewUserManagement = Omit<IUserManagement, 'login'> & { login: null };
