import { IOperation } from 'app/entities/operation/operation.model';

export interface ILabel {
  id?: number;
  label?: string;
  operations?: IOperation[] | null;
}

export class Label implements ILabel {
  constructor(public id?: number, public label?: string, public operations?: IOperation[] | null) {}
}

export function getLabelIdentifier(label: ILabel): number | undefined {
  return label.id;
}
