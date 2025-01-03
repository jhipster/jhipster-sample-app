import { IUser } from 'app/entities/user/user.model';
import { IOperation } from 'app/entities/operation/operation.model';

export interface IBankAccount {
  id: number;
  name: string;
  balance: number;
  country: string;
  user?: Pick<IUser, 'id' | 'login'> | null;
  operations?: Pick<IOperation, 'id' | 'description'>[] | null;
}

export type NewBankAccount = { id: null } & Omit<IBankAccount, 'id'>;
