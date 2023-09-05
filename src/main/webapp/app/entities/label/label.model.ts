import { IOperation } from 'app/entities/operation/operation.model';

export interface ILabel {
  id: number;
  label?: string | null;
  operations?: Pick<IOperation, 'id'>[] | null;
}

export type NewLabel = Omit<ILabel, 'id'> & { id: null };
