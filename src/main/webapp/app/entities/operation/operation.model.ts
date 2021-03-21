import * as dayjs from 'dayjs';
import { IBankAccount } from 'app/entities/bank-account/bank-account.model';
import { ILabel } from 'app/entities/label/label.model';

export interface IOperation {
  id?: number;
  date?: dayjs.Dayjs;
  description?: string | null;
  amount?: number;
  bankAccount?: IBankAccount | null;
  labels?: ILabel[] | null;
}

export class Operation implements IOperation {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs,
    public description?: string | null,
    public amount?: number,
    public bankAccount?: IBankAccount | null,
    public labels?: ILabel[] | null
  ) {}
}

export function getOperationIdentifier(operation: IOperation): number | undefined {
  return operation.id;
}
