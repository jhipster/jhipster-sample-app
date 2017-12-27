import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Operation } from './operation.model';
import { OperationPopupService } from './operation-popup.service';
import { OperationService } from './operation.service';
import { BankAccount, BankAccountService } from '../bank-account';
import { Label, LabelService } from '../label';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-operation-dialog',
    templateUrl: './operation-dialog.component.html'
})
export class OperationDialogComponent implements OnInit {

    operation: Operation;
    isSaving: boolean;

    bankaccounts: BankAccount[];

    labels: Label[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private operationService: OperationService,
        private bankAccountService: BankAccountService,
        private labelService: LabelService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.bankAccountService.query()
            .subscribe((res: ResponseWrapper) => { this.bankaccounts = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.labelService.query()
            .subscribe((res: ResponseWrapper) => { this.labels = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.operation.id !== undefined) {
            this.subscribeToSaveResponse(
                this.operationService.update(this.operation));
        } else {
            this.subscribeToSaveResponse(
                this.operationService.create(this.operation));
        }
    }

    private subscribeToSaveResponse(result: Observable<Operation>) {
        result.subscribe((res: Operation) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Operation) {
        this.eventManager.broadcast({ name: 'operationListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackBankAccountById(index: number, item: BankAccount) {
        return item.id;
    }

    trackLabelById(index: number, item: Label) {
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
}

@Component({
    selector: 'jhi-operation-popup',
    template: ''
})
export class OperationPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private operationPopupService: OperationPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.operationPopupService
                    .open(OperationDialogComponent as Component, params['id']);
            } else {
                this.operationPopupService
                    .open(OperationDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
