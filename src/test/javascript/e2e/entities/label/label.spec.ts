/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { LabelComponentsPage, LabelDeleteDialog, LabelUpdatePage } from './label.page-object';

const expect = chai.expect;

describe('Label e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let labelUpdatePage: LabelUpdatePage;
    let labelComponentsPage: LabelComponentsPage;
    let labelDeleteDialog: LabelDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Labels', async () => {
        await navBarPage.goToEntity('label');
        labelComponentsPage = new LabelComponentsPage();
        expect(await labelComponentsPage.getTitle()).to.eq('jhipsterSampleApplicationApp.label.home.title');
    });

    it('should load create Label page', async () => {
        await labelComponentsPage.clickOnCreateButton();
        labelUpdatePage = new LabelUpdatePage();
        expect(await labelUpdatePage.getPageTitle()).to.eq('jhipsterSampleApplicationApp.label.home.createOrEditLabel');
        await labelUpdatePage.cancel();
    });

    it('should create and save Labels', async () => {
        const nbButtonsBeforeCreate = await labelComponentsPage.countDeleteButtons();

        await labelComponentsPage.clickOnCreateButton();
        await promise.all([labelUpdatePage.setLabelInput('label')]);
        expect(await labelUpdatePage.getLabelInput()).to.eq('label');
        await labelUpdatePage.save();
        expect(await labelUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await labelComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Label', async () => {
        const nbButtonsBeforeDelete = await labelComponentsPage.countDeleteButtons();
        await labelComponentsPage.clickOnLastDeleteButton();

        labelDeleteDialog = new LabelDeleteDialog();
        expect(await labelDeleteDialog.getDialogTitle()).to.eq('jhipsterSampleApplicationApp.label.delete.question');
        await labelDeleteDialog.clickOnConfirmButton();

        expect(await labelComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
