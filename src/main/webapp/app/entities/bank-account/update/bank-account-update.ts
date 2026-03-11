import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserService } from 'app/entities/user/service/user.service';
import { IUser } from 'app/entities/user/user.model';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IBankAccount } from '../bank-account.model';
import { BankAccountService } from '../service/bank-account.service';

import { BankAccountFormGroup, BankAccountFormService } from './bank-account-form.service';

@Component({
  selector: 'jhi-bank-account-update',
  templateUrl: './bank-account-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class BankAccountUpdate implements OnInit {
  readonly isSaving = signal(false);
  bankAccount: IBankAccount | null = null;

  usersSharedCollection = signal<IUser[]>([]);

  protected bankAccountService = inject(BankAccountService);
  protected bankAccountFormService = inject(BankAccountFormService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: BankAccountFormGroup = this.bankAccountFormService.createBankAccountFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bankAccount }) => {
      this.bankAccount = bankAccount;
      if (bankAccount) {
        this.updateForm(bankAccount);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const bankAccount = this.bankAccountFormService.getBankAccount(this.editForm);
    if (bankAccount.id === null) {
      this.subscribeToSaveResponse(this.bankAccountService.create(bankAccount));
    } else {
      this.subscribeToSaveResponse(this.bankAccountService.update(bankAccount));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IBankAccount | null>): void {
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

  protected updateForm(bankAccount: IBankAccount): void {
    this.bankAccount = bankAccount;
    this.bankAccountFormService.resetForm(this.editForm, bankAccount);

    this.usersSharedCollection.update(users => this.userService.addUserToCollectionIfMissing<IUser>(users, bankAccount.user));
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.bankAccount?.user)))
      .subscribe((users: IUser[]) => this.usersSharedCollection.set(users));
  }
}
