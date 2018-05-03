import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBankAccount } from 'app/shared/model/bank-account.model';

@Component({
    selector: 'jhi-bank-account-detail',
    templateUrl: './bank-account-detail.component.html'
})
export class BankAccountDetailComponent implements OnInit {
    bankAccount: IBankAccount;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.data.subscribe(({ bankAccount }) => {
            this.bankAccount = bankAccount.body ? bankAccount.body : bankAccount;
        });
    }

    previousState() {
        window.history.back();
    }
}
