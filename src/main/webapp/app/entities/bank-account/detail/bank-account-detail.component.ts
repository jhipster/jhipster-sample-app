import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IBankAccount } from '../bank-account.model';

@Component({
  selector: 'jhi-bank-account-detail',
  templateUrl: './bank-account-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class BankAccountDetailComponent {
  bankAccount = input<IBankAccount | null>(null);

  previousState(): void {
    window.history.back();
  }
}
