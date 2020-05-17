import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBankAccount } from 'app/shared/model/bank-account.model';
import { BankAccountService } from './bank-account.service';

@Component({
  templateUrl: './bank-account-delete-dialog.component.html',
})
export class BankAccountDeleteDialogComponent {
  bankAccount?: IBankAccount;

  constructor(
    protected bankAccountService: BankAccountService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bankAccountService.delete(id).subscribe(() => {
      this.eventManager.broadcast('bankAccountListModification');
      this.activeModal.close();
    });
  }
}
