import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BankAccountComponentsPage, BankAccountUpdatePage } from './bank-account.page-object';

describe('BankAccount e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let bankAccountUpdatePage: BankAccountUpdatePage;
    let bankAccountComponentsPage: BankAccountComponentsPage;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load BankAccounts', async () => {
        await navBarPage.goToEntity('bank-account');
        bankAccountComponentsPage = new BankAccountComponentsPage();
        expect(await bankAccountComponentsPage.getTitle()).toMatch(/jhipsterSampleApplicationApp.bankAccount.home.title/);
    });

    it('should load create BankAccount page', async () => {
        await bankAccountComponentsPage.clickOnCreateButton();
        bankAccountUpdatePage = new BankAccountUpdatePage();
        expect(await bankAccountUpdatePage.getPageTitle()).toMatch(/jhipsterSampleApplicationApp.bankAccount.home.createOrEditLabel/);
        await bankAccountUpdatePage.cancel();
    });

    it('should create and save BankAccounts', async () => {
        await bankAccountComponentsPage.clickOnCreateButton();
        await bankAccountUpdatePage.setNameInput('name');
        expect(await bankAccountUpdatePage.getNameInput()).toMatch('name');
        await bankAccountUpdatePage.setBalanceInput('5');
        expect(await bankAccountUpdatePage.getBalanceInput()).toMatch('5');
        await bankAccountUpdatePage.userSelectLastOption();
        await bankAccountUpdatePage.save();
        expect(await bankAccountUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});
