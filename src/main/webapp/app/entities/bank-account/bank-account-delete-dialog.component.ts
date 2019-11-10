import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBankAccount } from 'app/shared/model/bank-account.model';
import { BankAccountService } from './bank-account.service';

@Component({
  selector: 'jhi-bank-account-delete-dialog',
  templateUrl: './bank-account-delete-dialog.component.html'
})
export class BankAccountDeleteDialogComponent {
  bankAccount: IBankAccount;

  constructor(
    protected bankAccountService: BankAccountService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.bankAccountService.delete(id).subscribe(() => {
      this.eventManager.broadcast({
        name: 'bankAccountListModification',
        content: 'Deleted an bankAccount'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-bank-account-delete-popup',
  template: ''
})
export class BankAccountDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ bankAccount }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(BankAccountDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.bankAccount = bankAccount;
        this.ngbModalRef.result.then(
          () => {
            this.router.navigate(['/bank-account', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          () => {
            this.router.navigate(['/bank-account', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
