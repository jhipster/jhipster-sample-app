import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhipsterSampleApplicationSharedModule } from 'app/shared/shared.module';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

import { adminState } from './admin.route';
import { AuditsComponent } from './audits/audits.component';
import { LogsComponent } from './logs/logs.component';
import { JhiMetricsMonitoringComponent } from './metrics/metrics.component';
import { JhiHealthModalComponent } from './health/health-modal.component';
import { JhiHealthCheckComponent } from './health/health.component';
import { JhiConfigurationComponent } from './configuration/configuration.component';
import { JhiDocsComponent } from './docs/docs.component';

@NgModule({
  imports: [
    JhipsterSampleApplicationSharedModule,
    /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    RouterModule.forChild(adminState)
  ],
  declarations: [
    AuditsComponent,
    LogsComponent,
    JhiConfigurationComponent,
    JhiHealthCheckComponent,
    JhiHealthModalComponent,
    JhiDocsComponent,
    JhiMetricsMonitoringComponent
  ],
  entryComponents: [JhiHealthModalComponent]
})
export class JhipsterSampleApplicationAdminModule {}
