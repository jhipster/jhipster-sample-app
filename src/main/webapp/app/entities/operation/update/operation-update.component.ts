import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IOperation, Operation } from '../operation.model';
import { OperationService } from '../service/operation.service';
import { IBankAccount } from 'app/entities/bank-account/bank-account.model';
import { BankAccountService } from 'app/entities/bank-account/service/bank-account.service';
import { ILabel } from 'app/entities/label/label.model';
import { LabelService } from 'app/entities/label/service/label.service';

@Component({
  selector: 'jhi-operation-update',
  templateUrl: './operation-update.component.html',
})
export class OperationUpdateComponent implements OnInit {
  isSaving = false;
  bankaccounts: IBankAccount[] = [];
  labels: ILabel[] = [];

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    description: [],
    amount: [null, [Validators.required]],
    bankAccount: [],
    labels: [],
  });

  constructor(
    protected operationService: OperationService,
    protected bankAccountService: BankAccountService,
    protected labelService: LabelService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ operation }) => {
      if (operation.id === undefined) {
        const today = dayjs().startOf('day');
        operation.date = today;
      }

      this.updateForm(operation);

      this.bankAccountService.query().subscribe((res: HttpResponse<IBankAccount[]>) => (this.bankaccounts = res.body ?? []));

      this.labelService.query().subscribe((res: HttpResponse<ILabel[]>) => (this.labels = res.body ?? []));
    });
  }

  updateForm(operation: IOperation): void {
    this.editForm.patchValue({
      id: operation.id,
      date: operation.date ? operation.date.format(DATE_TIME_FORMAT) : null,
      description: operation.description,
      amount: operation.amount,
      bankAccount: operation.bankAccount,
      labels: operation.labels,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const operation = this.createFromForm();
    if (operation.id !== undefined) {
      this.subscribeToSaveResponse(this.operationService.update(operation));
    } else {
      this.subscribeToSaveResponse(this.operationService.create(operation));
    }
  }

  private createFromForm(): IOperation {
    return {
      ...new Operation(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      description: this.editForm.get(['description'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      bankAccount: this.editForm.get(['bankAccount'])!.value,
      labels: this.editForm.get(['labels'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOperation>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackBankAccountById(index: number, item: IBankAccount): number {
    return item.id!;
  }

  trackLabelById(index: number, item: ILabel): number {
    return item.id!;
  }

  getSelectedLabel(option: ILabel, selectedVals?: ILabel[]): ILabel {
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
