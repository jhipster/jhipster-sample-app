import { Moment } from 'moment';
import { IBankAccount } from 'app/shared/model/bank-account.model';
import { ILabel } from 'app/shared/model/label.model';

export interface IOperation {
    id?: number;
    date?: Moment;
    description?: string;
    amount?: number;
    bankAccount?: IBankAccount;
    labels?: ILabel[];
}

export class Operation implements IOperation {
    constructor(
        public id?: number,
        public date?: Moment,
        public description?: string,
        public amount?: number,
        public bankAccount?: IBankAccount,
        public labels?: ILabel[]
    ) {}
}
