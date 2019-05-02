import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'bank-account',
        loadChildren: './bank-account/bank-account.module#JhipsterSampleApplicationBankAccountModule'
      },
      {
        path: 'label',
        loadChildren: './label/label.module#JhipsterSampleApplicationLabelModule'
      },
      {
        path: 'operation',
        loadChildren: './operation/operation.module#JhipsterSampleApplicationOperationModule'
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ],
  declarations: [],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterSampleApplicationEntityModule {}
