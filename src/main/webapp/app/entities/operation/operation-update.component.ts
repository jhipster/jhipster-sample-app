import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IOperation, Operation } from 'app/shared/model/operation.model';
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
  operation: IOperation;
  isSaving: boolean;

  bankaccounts: IBankAccount[];

  labels: ILabel[];

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    description: [],
    amount: [null, [Validators.required]],
    bankAccount: [],
    labels: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected operationService: OperationService,
    protected bankAccountService: BankAccountService,
    protected labelService: LabelService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ operation }) => {
      this.updateForm(operation);
      this.operation = operation;
    });
    this.bankAccountService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IBankAccount[]>) => mayBeOk.ok),
        map((response: HttpResponse<IBankAccount[]>) => response.body)
      )
      .subscribe((res: IBankAccount[]) => (this.bankaccounts = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.labelService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ILabel[]>) => mayBeOk.ok),
        map((response: HttpResponse<ILabel[]>) => response.body)
      )
      .subscribe((res: ILabel[]) => (this.labels = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(operation: IOperation) {
    this.editForm.patchValue({
      id: operation.id,
      date: operation.date != null ? operation.date.format(DATE_TIME_FORMAT) : null,
      description: operation.description,
      amount: operation.amount,
      bankAccount: operation.bankAccount,
      labels: operation.labels
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const operation = this.createFromForm();
    if (operation.id !== undefined) {
      this.subscribeToSaveResponse(this.operationService.update(operation));
    } else {
      this.subscribeToSaveResponse(this.operationService.create(operation));
    }
  }

  private createFromForm(): IOperation {
    const entity = {
      ...new Operation(),
      id: this.editForm.get(['id']).value,
      date: this.editForm.get(['date']).value != null ? moment(this.editForm.get(['date']).value, DATE_TIME_FORMAT) : undefined,
      description: this.editForm.get(['description']).value,
      amount: this.editForm.get(['amount']).value,
      bankAccount: this.editForm.get(['bankAccount']).value,
      labels: this.editForm.get(['labels']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOperation>>) {
    result.subscribe((res: HttpResponse<IOperation>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
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
}
