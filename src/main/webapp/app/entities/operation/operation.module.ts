import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { OperationComponent } from './list/operation.component';
import { OperationDetailComponent } from './detail/operation-detail.component';
import { OperationUpdateComponent } from './update/operation-update.component';
import { OperationDeleteDialogComponent } from './delete/operation-delete-dialog.component';
import { OperationRoutingModule } from './route/operation-routing.module';

@NgModule({
  imports: [SharedModule, OperationRoutingModule],
  declarations: [OperationComponent, OperationDetailComponent, OperationUpdateComponent, OperationDeleteDialogComponent],
  entryComponents: [OperationDeleteDialogComponent],
})
export class OperationModule {}
