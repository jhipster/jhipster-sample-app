import { element, by, promise, ElementFinder } from 'protractor';

export class OperationComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    title = element.all(by.css('jhi-operation div h2#page-heading span')).first();

    clickOnCreateButton(): promise.Promise<void> {
        return this.createButton.click();
    }

    getTitle(): any {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class OperationUpdatePage {
    pageTitle = element(by.id('jhi-operation-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    dateInput = element(by.id('field_date'));
    descriptionInput = element(by.id('field_description'));
    amountInput = element(by.id('field_amount'));
    bankAccountSelect = element(by.id('field_bankAccount'));
    labelSelect = element(by.id('field_label'));

    getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    setDateInput(date): promise.Promise<void> {
        return this.dateInput.sendKeys(date);
    }

    getDateInput() {
        return this.dateInput.getAttribute('value');
    }

    setDescriptionInput(description): promise.Promise<void> {
        return this.descriptionInput.sendKeys(description);
    }

    getDescriptionInput() {
        return this.descriptionInput.getAttribute('value');
    }

    setAmountInput(amount): promise.Promise<void> {
        return this.amountInput.sendKeys(amount);
    }

    getAmountInput() {
        return this.amountInput.getAttribute('value');
    }

    bankAccountSelectLastOption(): promise.Promise<void> {
        return this.bankAccountSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    bankAccountSelectOption(option): promise.Promise<void> {
        return this.bankAccountSelect.sendKeys(option);
    }

    getBankAccountSelect(): ElementFinder {
        return this.bankAccountSelect;
    }

    getBankAccountSelectedOption() {
        return this.bankAccountSelect.element(by.css('option:checked')).getText();
    }

    labelSelectLastOption(): promise.Promise<void> {
        return this.labelSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    labelSelectOption(option): promise.Promise<void> {
        return this.labelSelect.sendKeys(option);
    }

    getLabelSelect(): ElementFinder {
        return this.labelSelect;
    }

    getLabelSelectedOption() {
        return this.labelSelect.element(by.css('option:checked')).getText();
    }

    save(): promise.Promise<void> {
        return this.saveButton.click();
    }

    cancel(): promise.Promise<void> {
        return this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}
