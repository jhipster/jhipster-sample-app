import { browser } from 'protractor';
import { NavBarPage } from './../../page-objects/jhi-page-objects';
import { BankAccountComponentsPage, BankAccountUpdatePage } from './bank-account.page-object';

describe('BankAccount e2e test', () => {
    let navBarPage: NavBarPage;
    let bankAccountUpdatePage: BankAccountUpdatePage;
    let bankAccountComponentsPage: BankAccountComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load BankAccounts', () => {
        navBarPage.goToEntity('bank-account');
        bankAccountComponentsPage = new BankAccountComponentsPage();
        expect(bankAccountComponentsPage.getTitle()).toMatch(/jhipsterSampleApplicationApp.bankAccount.home.title/);
    });

    it('should load create BankAccount page', () => {
        bankAccountComponentsPage.clickOnCreateButton();
        bankAccountUpdatePage = new BankAccountUpdatePage();
        expect(bankAccountUpdatePage.getPageTitle()).toMatch(/jhipsterSampleApplicationApp.bankAccount.home.createOrEditLabel/);
        bankAccountUpdatePage.cancel();
    });

    it('should create and save BankAccounts', () => {
        bankAccountComponentsPage.clickOnCreateButton();
        bankAccountUpdatePage.setNameInput('name');
        expect(bankAccountUpdatePage.getNameInput()).toMatch('name');
        bankAccountUpdatePage.setBalanceInput('5');
        expect(bankAccountUpdatePage.getBalanceInput()).toMatch('5');
        bankAccountUpdatePage.userSelectLastOption();
        bankAccountUpdatePage.save();
        expect(bankAccountUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});
