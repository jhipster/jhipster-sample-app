import { BaseEntity } from './../../shared';

export class Operation implements BaseEntity {
    constructor(
        public id?: number,
        public date?: any,
        public description?: string,
        public amount?: number,
        public bankAccount?: BaseEntity,
        public labels?: BaseEntity[],
    ) {
    }
}
