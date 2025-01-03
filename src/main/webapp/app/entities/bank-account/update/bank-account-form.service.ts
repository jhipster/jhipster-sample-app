import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBankAccount, NewBankAccount } from '../bank-account.model';

type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

type BankAccountFormGroupInput = IBankAccount | PartialWithRequiredKeyOf<NewBankAccount>;

type BankAccountFormDefaults = Pick<NewBankAccount, 'id'>;

type BankAccountFormGroupContent = {
  id: FormControl<IBankAccount['id'] | NewBankAccount['id']>;
  name: FormControl<IBankAccount['name']>;
  balance: FormControl<IBankAccount['balance']>;
  country: FormControl<IBankAccount['country']>;
  user: FormControl<IBankAccount['user']>;
};

export type BankAccountFormGroup = FormGroup<BankAccountFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BankAccountFormService {
  createBankAccountFormGroup(bankAccount: BankAccountFormGroupInput = { id: null }): BankAccountFormGroup {
    const bankAccountRawValue = {
      ...this.getFormDefaults(),
      ...bankAccount,
    };
    return new FormGroup<BankAccountFormGroupContent>({
      id: new FormControl(
        { value: bankAccountRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(bankAccountRawValue.name ?? '', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      balance: new FormControl(bankAccountRawValue.balance ?? 0, {
        validators: [Validators.required],
        nonNullable: true,
      }),
      country: new FormControl(bankAccountRawValue.country ?? 'US', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      user: new FormControl(bankAccountRawValue.user ?? null),
    });
  }

  getBankAccount(form: BankAccountFormGroup): IBankAccount | NewBankAccount {
    return form.getRawValue() as IBankAccount | NewBankAccount;
  }

  resetForm(form: BankAccountFormGroup, bankAccount: IBankAccount): void {
    const bankAccountRawValue = { ...this.getFormDefaults(), ...bankAccount };
    form.reset(
      {
        ...bankAccountRawValue,
        id: { value: bankAccountRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BankAccountFormDefaults {
    return {
      id: null,
    };
  }
}
