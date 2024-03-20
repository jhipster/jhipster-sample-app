import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IBankAccount } from '../bank-account.model';

@Component({
  standalone: true,
  selector: 'jhi-bank-account-detail',
  templateUrl: './bank-account-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class BankAccountDetailComponent {
  @Input() bankAccount: IBankAccount | null = null;

  previousState(): void {
    window.history.back();
  }
}
