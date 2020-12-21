import * as dayjs from 'dayjs';
import { IBankAccount } from 'app/entities/bank-account/bank-account.model';
import { ILabel } from 'app/entities/label/label.model';

export interface IOperation {
  id?: number;
  date?: dayjs.Dayjs;
  description?: string;
  amount?: number;
  bankAccount?: IBankAccount;
  labels?: ILabel[];
}

export class Operation implements IOperation {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs,
    public description?: string,
    public amount?: number,
    public bankAccount?: IBankAccount,
    public labels?: ILabel[]
  ) {}
}
