import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IBankAccount } from '../bank-account.model';
import { BankAccountService } from '../service/bank-account.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './bank-account-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class BankAccountDeleteDialogComponent {
  bankAccount?: IBankAccount;

  constructor(protected bankAccountService: BankAccountService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bankAccountService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
