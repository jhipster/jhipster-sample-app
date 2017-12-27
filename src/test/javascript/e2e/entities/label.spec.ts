import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Label e2e test', () => {

    let navBarPage: NavBarPage;
    let labelDialogPage: LabelDialogPage;
    let labelComponentsPage: LabelComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Labels', () => {
        navBarPage.goToEntity('label');
        labelComponentsPage = new LabelComponentsPage();
        expect(labelComponentsPage.getTitle())
            .toMatch(/jhipsterSampleApplicationApp.label.home.title/);

    });

    it('should load create Label dialog', () => {
        labelComponentsPage.clickOnCreateButton();
        labelDialogPage = new LabelDialogPage();
        expect(labelDialogPage.getModalTitle())
            .toMatch(/jhipsterSampleApplicationApp.label.home.createOrEditLabel/);
        labelDialogPage.close();
    });

    it('should create and save Labels', () => {
        labelComponentsPage.clickOnCreateButton();
        labelDialogPage.setLabelInput('label');
        expect(labelDialogPage.getLabelInput()).toMatch('label');
        labelDialogPage.save();
        expect(labelDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class LabelComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-label div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class LabelDialogPage {
    modalTitle = element(by.css('h4#myLabelLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    labelInput = element(by.css('input#field_label'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setLabelInput = function(label) {
        this.labelInput.sendKeys(label);
    }

    getLabelInput = function() {
        return this.labelInput.getAttribute('value');
    }

    save() {
        this.saveButton.click();
    }

    close() {
        this.closeButton.click();
    }

    getSaveButton() {
        return this.saveButton;
    }
}
