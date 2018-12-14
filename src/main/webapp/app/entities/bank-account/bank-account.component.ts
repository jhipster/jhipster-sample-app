import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IBankAccount } from 'app/shared/model/bank-account.model';
import { AccountService } from 'app/core';
import { BankAccountService } from './bank-account.service';

@Component({
  selector: 'jhi-bank-account',
  templateUrl: './bank-account.component.html'
})
export class BankAccountComponent implements OnInit, OnDestroy {
  bankAccounts: IBankAccount[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected bankAccountService: BankAccountService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.bankAccountService.query().subscribe(
      (res: HttpResponse<IBankAccount[]>) => {
        this.bankAccounts = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInBankAccounts();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IBankAccount) {
    return item.id;
  }

  registerChangeInBankAccounts() {
    this.eventSubscriber = this.eventManager.subscribe('bankAccountListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
