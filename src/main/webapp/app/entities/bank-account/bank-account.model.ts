import { IUser } from 'app/entities/user/user.model';

export interface IBankAccount {
  id: number;
  name?: string | null;
  balance?: number | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewBankAccount = Omit<IBankAccount, 'id'> & { id: null };
