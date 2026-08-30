import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Alert, AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { IBankAccount } from '../bank-account.model';

@Component({
  selector: 'jhi-bank-account-detail',
  templateUrl: './bank-account-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, RouterLink],
})
export class BankAccountDetail {
  readonly bankAccount = input<IBankAccount | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
