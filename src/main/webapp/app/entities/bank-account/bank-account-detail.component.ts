import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { BankAccount } from './bank-account.model';
import { BankAccountService } from './bank-account.service';

@Component({
    selector: 'jhi-bank-account-detail',
    templateUrl: './bank-account-detail.component.html'
})
export class BankAccountDetailComponent implements OnInit, OnDestroy {

    bankAccount: BankAccount;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private bankAccountService: BankAccountService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInBankAccounts();
    }

    load(id) {
        this.bankAccountService.find(id)
            .subscribe((bankAccountResponse: HttpResponse<BankAccount>) => {
                this.bankAccount = bankAccountResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInBankAccounts() {
        this.eventSubscriber = this.eventManager.subscribe(
            'bankAccountListModification',
            (response) => this.load(this.bankAccount.id)
        );
    }
}
