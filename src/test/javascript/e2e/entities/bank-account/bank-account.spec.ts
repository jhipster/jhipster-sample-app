import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BankAccountComponentsPage, BankAccountDeleteDialog, BankAccountUpdatePage } from './bank-account.page-object';

const expect = chai.expect;

describe('BankAccount e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let bankAccountComponentsPage: BankAccountComponentsPage;
  let bankAccountUpdatePage: BankAccountUpdatePage;
  let bankAccountDeleteDialog: BankAccountDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load BankAccounts', async () => {
    await navBarPage.goToEntity('bank-account');
    bankAccountComponentsPage = new BankAccountComponentsPage();
    await browser.wait(ec.visibilityOf(bankAccountComponentsPage.title), 5000);
    expect(await bankAccountComponentsPage.getTitle()).to.eq('jhipsterSampleApplicationApp.bankAccount.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(bankAccountComponentsPage.entities), ec.visibilityOf(bankAccountComponentsPage.noResult)),
      1000
    );
  });

  it('should load create BankAccount page', async () => {
    await bankAccountComponentsPage.clickOnCreateButton();
    bankAccountUpdatePage = new BankAccountUpdatePage();
    expect(await bankAccountUpdatePage.getPageTitle()).to.eq('jhipsterSampleApplicationApp.bankAccount.home.createOrEditLabel');
    await bankAccountUpdatePage.cancel();
  });

  it('should create and save BankAccounts', async () => {
    const nbButtonsBeforeCreate = await bankAccountComponentsPage.countDeleteButtons();

    await bankAccountComponentsPage.clickOnCreateButton();

    await promise.all([
      bankAccountUpdatePage.setNameInput('name'),
      bankAccountUpdatePage.setBalanceInput('5'),
      bankAccountUpdatePage.userSelectLastOption(),
    ]);

    expect(await bankAccountUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await bankAccountUpdatePage.getBalanceInput()).to.eq('5', 'Expected balance value to be equals to 5');

    await bankAccountUpdatePage.save();
    expect(await bankAccountUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await bankAccountComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last BankAccount', async () => {
    const nbButtonsBeforeDelete = await bankAccountComponentsPage.countDeleteButtons();
    await bankAccountComponentsPage.clickOnLastDeleteButton();

    bankAccountDeleteDialog = new BankAccountDeleteDialog();
    expect(await bankAccountDeleteDialog.getDialogTitle()).to.eq('jhipsterSampleApplicationApp.bankAccount.delete.question');
    await bankAccountDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(bankAccountComponentsPage.title), 5000);

    expect(await bankAccountComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
