import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'user-management',
    title: 'userManagement.home.title',
    loadChildren: () => import('./admin/user-management/user-management.routes'),
  },
  {
    path: 'authority',
    title: 'jhipsterSampleApplicationApp.adminAuthority.home.title',
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'bank-account',
    title: 'jhipsterSampleApplicationApp.bankAccount.home.title',
    loadChildren: () => import('./bank-account/bank-account.routes'),
  },
  {
    path: 'label',
    title: 'jhipsterSampleApplicationApp.label.home.title',
    loadChildren: () => import('./label/label.routes'),
  },
  {
    path: 'operation',
    title: 'jhipsterSampleApplicationApp.operation.home.title',
    loadChildren: () => import('./operation/operation.routes'),
  },
  // jhipster-needle-add-entity-route - JHipster will add entity modules routes here
];

export default routes;
