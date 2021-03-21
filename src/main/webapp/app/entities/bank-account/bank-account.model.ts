import { IUser } from 'app/entities/user/user.model';
import { IOperation } from 'app/entities/operation/operation.model';

export interface IBankAccount {
  id?: number;
  name?: string;
  balance?: number;
  user?: IUser | null;
  operations?: IOperation[] | null;
}

export class BankAccount implements IBankAccount {
  constructor(
    public id?: number,
    public name?: string,
    public balance?: number,
    public user?: IUser | null,
    public operations?: IOperation[] | null
  ) {}
}

export function getBankAccountIdentifier(bankAccount: IBankAccount): number | undefined {
  return bankAccount.id;
}
