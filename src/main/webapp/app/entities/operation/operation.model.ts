import dayjs from 'dayjs/esm';
import { IBankAccount } from 'app/entities/bank-account/bank-account.model';
import { ILabel } from 'app/entities/label/label.model';

export interface IOperation {
  id: number;
  date?: dayjs.Dayjs | null;
  description?: string | null;
  amount?: number | null;
  bankAccount?: Pick<IBankAccount, 'id' | 'name'> | null;
  labels?: Pick<ILabel, 'id' | 'label'>[] | null;
}

export type NewOperation = Omit<IOperation, 'id'> & { id: null };
