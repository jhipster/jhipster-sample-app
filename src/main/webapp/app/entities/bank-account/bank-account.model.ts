import { IUser } from 'app/entities/user/user.model';
import { IOperation } from 'app/entities/operation/operation.model';

export interface IBankAccount {
  id: number;
  name?: string | null;
  balance?: number | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  operations?: IOperation[] | null;
}

export type NewBankAccount = Omit<IBankAccount, 'id'> & { id: null };
