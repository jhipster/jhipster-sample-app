import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBankAccount } from 'app/entities/bank-account/bank-account.model';
import { BankAccountService } from 'app/entities/bank-account/service/bank-account.service';
import { ILabel } from 'app/entities/label/label.model';
import { LabelService } from 'app/entities/label/service/label.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IOperation } from '../operation.model';
import { OperationService } from '../service/operation.service';

import { OperationFormGroup, OperationFormService } from './operation-form.service';

@Component({
  selector: 'jhi-operation-update',
  templateUrl: './operation-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class OperationUpdate implements OnInit {
  readonly isSaving = signal(false);
  operation: IOperation | null = null;

  bankAccountsSharedCollection = signal<IBankAccount[]>([]);
  labelsSharedCollection = signal<ILabel[]>([]);

  protected operationService = inject(OperationService);
  protected operationFormService = inject(OperationFormService);
  protected bankAccountService = inject(BankAccountService);
  protected labelService = inject(LabelService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: OperationFormGroup = this.operationFormService.createOperationFormGroup();

  compareBankAccount = (o1: IBankAccount | null, o2: IBankAccount | null): boolean => this.bankAccountService.compareBankAccount(o1, o2);

  compareLabel = (o1: ILabel | null, o2: ILabel | null): boolean => this.labelService.compareLabel(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ operation }) => {
      this.operation = operation;
      if (operation) {
        this.updateForm(operation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const operation = this.operationFormService.getOperation(this.editForm);
    if (operation.id === null) {
      this.subscribeToSaveResponse(this.operationService.create(operation));
    } else {
      this.subscribeToSaveResponse(this.operationService.update(operation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IOperation | null>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving.set(false);
  }

  protected updateForm(operation: IOperation): void {
    this.operation = operation;
    this.operationFormService.resetForm(this.editForm, operation);

    this.bankAccountsSharedCollection.update(bankAccounts =>
      this.bankAccountService.addBankAccountToCollectionIfMissing<IBankAccount>(bankAccounts, operation.bankAccount),
    );
    this.labelsSharedCollection.update(labels =>
      this.labelService.addLabelToCollectionIfMissing<ILabel>(labels, ...(operation.labels ?? [])),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.bankAccountService
      .query()
      .pipe(map((res: HttpResponse<IBankAccount[]>) => res.body ?? []))
      .pipe(
        map((bankAccounts: IBankAccount[]) =>
          this.bankAccountService.addBankAccountToCollectionIfMissing<IBankAccount>(bankAccounts, this.operation?.bankAccount),
        ),
      )
      .subscribe((bankAccounts: IBankAccount[]) => this.bankAccountsSharedCollection.set(bankAccounts));

    this.labelService
      .query()
      .pipe(map((res: HttpResponse<ILabel[]>) => res.body ?? []))
      .pipe(map((labels: ILabel[]) => this.labelService.addLabelToCollectionIfMissing<ILabel>(labels, ...(this.operation?.labels ?? []))))
      .subscribe((labels: ILabel[]) => this.labelsSharedCollection.set(labels));
  }
}
