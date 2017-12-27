import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { BankAccount } from './bank-account.model';
import { BankAccountService } from './bank-account.service';
import { Principal, ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-bank-account',
    templateUrl: './bank-account.component.html'
})
export class BankAccountComponent implements OnInit, OnDestroy {
bankAccounts: BankAccount[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private bankAccountService: BankAccountService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.bankAccountService.query().subscribe(
            (res: ResponseWrapper) => {
                this.bankAccounts = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInBankAccounts();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: BankAccount) {
        return item.id;
    }
    registerChangeInBankAccounts() {
        this.eventSubscriber = this.eventManager.subscribe('bankAccountListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
