import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { IOperation } from 'app/shared/model/operation.model';
import { OperationService } from './operation.service';
import { IBankAccount } from 'app/shared/model/bank-account.model';
import { BankAccountService } from 'app/entities/bank-account';
import { ILabel } from 'app/shared/model/label.model';
import { LabelService } from 'app/entities/label';

@Component({
    selector: 'jhi-operation-update',
    templateUrl: './operation-update.component.html'
})
export class OperationUpdateComponent implements OnInit {
    private _operation: IOperation;
    isSaving: boolean;

    bankaccounts: IBankAccount[];

    labels: ILabel[];
    date: string;

    constructor(
        private jhiAlertService: JhiAlertService,
        private operationService: OperationService,
        private bankAccountService: BankAccountService,
        private labelService: LabelService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ operation }) => {
            this.operation = operation;
        });
        this.bankAccountService.query().subscribe(
            (res: HttpResponse<IBankAccount[]>) => {
                this.bankaccounts = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.labelService.query().subscribe(
            (res: HttpResponse<ILabel[]>) => {
                this.labels = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.operation.date = moment(this.date, DATE_TIME_FORMAT);
        if (this.operation.id !== undefined) {
            this.subscribeToSaveResponse(this.operationService.update(this.operation));
        } else {
            this.subscribeToSaveResponse(this.operationService.create(this.operation));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IOperation>>) {
        result.subscribe((res: HttpResponse<IOperation>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackBankAccountById(index: number, item: IBankAccount) {
        return item.id;
    }

    trackLabelById(index: number, item: ILabel) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
    get operation() {
        return this._operation;
    }

    set operation(operation: IOperation) {
        this._operation = operation;
        this.date = moment(operation.date).format(DATE_TIME_FORMAT);
    }
}
