import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'jhipsterSampleApplicationApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'bank-account',
    data: { pageTitle: 'jhipsterSampleApplicationApp.bankAccount.home.title' },
    loadChildren: () => import('./bank-account/bank-account.routes'),
  },
  {
    path: 'label',
    data: { pageTitle: 'jhipsterSampleApplicationApp.label.home.title' },
    loadChildren: () => import('./label/label.routes'),
  },
  {
    path: 'operation',
    data: { pageTitle: 'jhipsterSampleApplicationApp.operation.home.title' },
    loadChildren: () => import('./operation/operation.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
