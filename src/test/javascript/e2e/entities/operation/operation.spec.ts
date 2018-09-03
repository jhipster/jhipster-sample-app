import { browser, ExpectedConditions as ec, protractor } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { OperationComponentsPage, OperationDeleteDialog, OperationUpdatePage } from './operation.page-object';

describe('Operation e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let operationUpdatePage: OperationUpdatePage;
    let operationComponentsPage: OperationComponentsPage;
    let operationDeleteDialog: OperationDeleteDialog;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Operations', async () => {
        await navBarPage.goToEntity('operation');
        operationComponentsPage = new OperationComponentsPage();
        expect(await operationComponentsPage.getTitle()).toMatch(/jhipsterSampleApplicationApp.operation.home.title/);
    });

    it('should load create Operation page', async () => {
        await operationComponentsPage.clickOnCreateButton();
        operationUpdatePage = new OperationUpdatePage();
        expect(await operationUpdatePage.getPageTitle()).toMatch(/jhipsterSampleApplicationApp.operation.home.createOrEditLabel/);
        await operationUpdatePage.cancel();
    });

    it('should create and save Operations', async () => {
        await operationComponentsPage.clickOnCreateButton();
        await operationUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
        expect(await operationUpdatePage.getDateInput()).toContain('2001-01-01T02:30');
        await operationUpdatePage.setDescriptionInput('description');
        expect(await operationUpdatePage.getDescriptionInput()).toMatch('description');
        await operationUpdatePage.setAmountInput('5');
        expect(await operationUpdatePage.getAmountInput()).toMatch('5');
        await operationUpdatePage.bankAccountSelectLastOption();
        // operationUpdatePage.labelSelectLastOption();
        await operationUpdatePage.save();
        expect(await operationUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    it('should delete last Operation', async () => {
        const nbButtonsBeforeDelete = await operationComponentsPage.countDeleteButtons();
        await operationComponentsPage.clickOnLastDeleteButton();

        operationDeleteDialog = new OperationDeleteDialog();
        expect(await operationDeleteDialog.getDialogTitle()).toMatch(/jhipsterSampleApplicationApp.operation.delete.question/);
        await operationDeleteDialog.clickOnConfirmButton();

        expect(await operationComponentsPage.countDeleteButtons()).toBe(nbButtonsBeforeDelete - 1);
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});
