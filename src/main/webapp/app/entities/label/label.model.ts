import { BaseEntity } from './../../shared';

export class Label implements BaseEntity {
    constructor(
        public id?: number,
        public label?: string,
        public operations?: BaseEntity[],
    ) {
    }
}
