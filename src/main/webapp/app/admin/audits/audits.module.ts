import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhipsterSampleApplicationSharedModule } from 'app/shared/shared.module';

import { AuditsComponent } from './audits.component';

import { auditsRoute } from './audits.route';

@NgModule({
  imports: [JhipsterSampleApplicationSharedModule, RouterModule.forChild([auditsRoute])],
  declarations: [AuditsComponent],
})
export class AuditsModule {}
