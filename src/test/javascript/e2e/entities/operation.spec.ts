import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Operation e2e test', () => {

    let navBarPage: NavBarPage;
    let operationDialogPage: OperationDialogPage;
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
        expect(operationComponentsPage.getTitle())
            .toMatch(/jhipsterSampleApplicationApp.operation.home.title/);

    });

    it('should load create Operation dialog', () => {
        operationComponentsPage.clickOnCreateButton();
        operationDialogPage = new OperationDialogPage();
        expect(operationDialogPage.getModalTitle())
            .toMatch(/jhipsterSampleApplicationApp.operation.home.createOrEditLabel/);
        operationDialogPage.close();
    });

    it('should create and save Operations', () => {
        operationComponentsPage.clickOnCreateButton();
        operationDialogPage.setDateInput(12310020012301);
        expect(operationDialogPage.getDateInput()).toMatch('2001-12-31T02:30');
        operationDialogPage.setDescriptionInput('description');
        expect(operationDialogPage.getDescriptionInput()).toMatch('description');
        operationDialogPage.setAmountInput('5');
        expect(operationDialogPage.getAmountInput()).toMatch('5');
        operationDialogPage.bankAccountSelectLastOption();
        // operationDialogPage.labelSelectLastOption();
        operationDialogPage.save();
        expect(operationDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class OperationComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-operation div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class OperationDialogPage {
    modalTitle = element(by.css('h4#myOperationLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    dateInput = element(by.css('input#field_date'));
    descriptionInput = element(by.css('input#field_description'));
    amountInput = element(by.css('input#field_amount'));
    bankAccountSelect = element(by.css('select#field_bankAccount'));
    labelSelect = element(by.css('select#field_label'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setDateInput = function(date) {
        this.dateInput.sendKeys(date);
    }

    getDateInput = function() {
        return this.dateInput.getAttribute('value');
    }

    setDescriptionInput = function(description) {
        this.descriptionInput.sendKeys(description);
    }

    getDescriptionInput = function() {
        return this.descriptionInput.getAttribute('value');
    }

    setAmountInput = function(amount) {
        this.amountInput.sendKeys(amount);
    }

    getAmountInput = function() {
        return this.amountInput.getAttribute('value');
    }

    bankAccountSelectLastOption = function() {
        this.bankAccountSelect.all(by.tagName('option')).last().click();
    }

    bankAccountSelectOption = function(option) {
        this.bankAccountSelect.sendKeys(option);
    }

    getBankAccountSelect = function() {
        return this.bankAccountSelect;
    }

    getBankAccountSelectedOption = function() {
        return this.bankAccountSelect.element(by.css('option:checked')).getText();
    }

    labelSelectLastOption = function() {
        this.labelSelect.all(by.tagName('option')).last().click();
    }

    labelSelectOption = function(option) {
        this.labelSelect.sendKeys(option);
    }

    getLabelSelect = function() {
        return this.labelSelect;
    }

    getLabelSelectedOption = function() {
        return this.labelSelect.element(by.css('option:checked')).getText();
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
