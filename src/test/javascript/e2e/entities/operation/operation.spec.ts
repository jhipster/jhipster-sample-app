import { browser, protractor } from 'protractor';
import { NavBarPage } from './../../page-objects/jhi-page-objects';
import { OperationComponentsPage, OperationUpdatePage } from './operation.page-object';

describe('Operation e2e test', () => {
  let navBarPage: NavBarPage;
  let operationUpdatePage: OperationUpdatePage;
  let operationComponentsPage: OperationComponentsPage;

  beforeAll(() => {
    browser.get('/');
    browser.waitForAngular();
    navBarPage = new NavBarPage();
    navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
    browser.waitForAngular();
  });

  it('should load Operations', () => {
    navBarPage.goToEntity('operation');
    operationComponentsPage = new OperationComponentsPage();
    expect(operationComponentsPage.getTitle()).toMatch(/jhipsterSampleApplicationApp.operation.home.title/);
  });

  it('should load create Operation page', () => {
    operationComponentsPage.clickOnCreateButton();
    operationUpdatePage = new OperationUpdatePage();
    expect(operationUpdatePage.getPageTitle()).toMatch(/jhipsterSampleApplicationApp.operation.home.createOrEditLabel/);
    operationUpdatePage.cancel();
  });

  it('should create and save Operations', () => {
    operationComponentsPage.clickOnCreateButton();
    operationUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(operationUpdatePage.getDateInput()).toContain('2001-01-01T02:30');
    operationUpdatePage.setDescriptionInput('description');
    expect(operationUpdatePage.getDescriptionInput()).toMatch('description');
    operationUpdatePage.setAmountInput('5');
    expect(operationUpdatePage.getAmountInput()).toMatch('5');
    operationUpdatePage.bankAccountSelectLastOption();
    // operationUpdatePage.labelSelectLastOption();
    operationUpdatePage.save();
    expect(operationUpdatePage.getSaveButton().isPresent()).toBeFalsy();
  });

  afterAll(() => {
    navBarPage.autoSignOut();
  });
});
