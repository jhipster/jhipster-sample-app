import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBankAccount } from '../bank-account.model';
import { BankAccountService } from '../service/bank-account.service';

@Component({
  templateUrl: './bank-account-delete-dialog.component.html',
})
export class BankAccountDeleteDialogComponent {
  bankAccount?: IBankAccount;

  constructor(protected bankAccountService: BankAccountService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bankAccountService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
