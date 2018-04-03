import { IUser } from 'app/core/user/user.model';
import { IOperation } from './operation.model';

export interface IBankAccount {
  id?: number;
  name?: string;
  balance?: number;
  user?: IUser;
  operations?: IOperation[];
}

export class BankAccount implements IBankAccount {
  constructor(public id?: number, public name?: string, public balance?: number, public user?: IUser, public operations?: IOperation[]) {}
}
