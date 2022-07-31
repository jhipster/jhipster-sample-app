import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BankAccountComponent } from './list/bank-account.component';
import { BankAccountDetailComponent } from './detail/bank-account-detail.component';
import { BankAccountUpdateComponent } from './update/bank-account-update.component';
import { BankAccountDeleteDialogComponent } from './delete/bank-account-delete-dialog.component';
import { BankAccountRoutingModule } from './route/bank-account-routing.module';

@NgModule({
  imports: [SharedModule, BankAccountRoutingModule],
  declarations: [BankAccountComponent, BankAccountDetailComponent, BankAccountUpdateComponent, BankAccountDeleteDialogComponent],
})
export class BankAccountModule {}
