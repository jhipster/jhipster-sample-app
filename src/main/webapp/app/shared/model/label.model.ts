import { IOperation } from './operation.model';

export interface ILabel {
  id?: number;
  label?: string;
  operations?: IOperation[];
}

export class Label implements ILabel {
  constructor(public id?: number, public label?: string, public operations?: IOperation[]) {}
}
