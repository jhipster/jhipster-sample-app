import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOperation } from 'app/shared/model/operation.model';

@Component({
    selector: 'jhi-operation-detail',
    templateUrl: './operation-detail.component.html'
})
export class OperationDetailComponent implements OnInit {
    operation: IOperation;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ operation }) => {
            this.operation = operation;
        });
    }

    previousState() {
        window.history.back();
    }
}
