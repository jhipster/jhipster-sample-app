import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { AccountService } from 'app/core/auth/account.service';
import { TranslateDirective } from 'app/shared/language';

import PasswordStrengthBar from './password-strength-bar/password-strength-bar';
import { PasswordService } from './password.service';

@Component({
  selector: 'jhi-password',
  imports: [TranslateDirective, TranslateModule, ReactiveFormsModule, PasswordStrengthBar],
  templateUrl: './password.html',
})
export default class Password {
  readonly doNotMatch = signal(false);
  readonly error = signal(false);
  readonly success = signal(false);
  readonly account = inject(AccountService).account;
  passwordForm = new FormGroup({
    currentPassword: new FormControl('', { nonNullable: true, validators: Validators.required }),
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
  });

  private readonly passwordService = inject(PasswordService);

  changePassword(): void {
    this.error.set(false);
    this.success.set(false);
    this.doNotMatch.set(false);

    const { newPassword, confirmPassword, currentPassword } = this.passwordForm.getRawValue();
    if (newPassword === confirmPassword) {
      this.passwordService.save(newPassword, currentPassword).subscribe({
        next: () => this.success.set(true),
        error: () => this.error.set(true),
      });
    } else {
      this.doNotMatch.set(true);
    }
  }
}
