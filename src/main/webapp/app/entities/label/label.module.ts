import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LabelComponent } from './list/label.component';
import { LabelDetailComponent } from './detail/label-detail.component';
import { LabelUpdateComponent } from './update/label-update.component';
import { LabelDeleteDialogComponent } from './delete/label-delete-dialog.component';
import { LabelRoutingModule } from './route/label-routing.module';

@NgModule({
  imports: [SharedModule, LabelRoutingModule],
  declarations: [LabelComponent, LabelDetailComponent, LabelUpdateComponent, LabelDeleteDialogComponent],
})
export class LabelModule {}
