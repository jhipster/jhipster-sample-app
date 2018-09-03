import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { LabelComponentsPage, LabelUpdatePage } from './label.page-object';

describe('Label e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let labelUpdatePage: LabelUpdatePage;
    let labelComponentsPage: LabelComponentsPage;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Labels', async () => {
        await navBarPage.goToEntity('label');
        labelComponentsPage = new LabelComponentsPage();
        expect(await labelComponentsPage.getTitle()).toMatch(/jhipsterSampleApplicationApp.label.home.title/);
    });

    it('should load create Label page', async () => {
        await labelComponentsPage.clickOnCreateButton();
        labelUpdatePage = new LabelUpdatePage();
        expect(await labelUpdatePage.getPageTitle()).toMatch(/jhipsterSampleApplicationApp.label.home.createOrEditLabel/);
        await labelUpdatePage.cancel();
    });

    it('should create and save Labels', async () => {
        await labelComponentsPage.clickOnCreateButton();
        await labelUpdatePage.setLabelInput('label');
        expect(await labelUpdatePage.getLabelInput()).toMatch('label');
        await labelUpdatePage.save();
        expect(await labelUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});
