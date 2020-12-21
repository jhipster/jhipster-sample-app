import { IOperation } from 'app/entities/operation/operation.model';

export interface ILabel {
  id?: number;
  label?: string;
  operations?: IOperation[];
}

export class Label implements ILabel {
  constructor(public id?: number, public label?: string, public operations?: IOperation[]) {}
}
