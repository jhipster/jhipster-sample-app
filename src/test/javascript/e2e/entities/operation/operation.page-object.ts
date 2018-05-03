import { element, by } from 'protractor';

export class OperationComponentsPage {
    createButton = element(by.css('#jh-create-entity'));
    title = element.all(by.css('jhi-operation div h2#page-heading span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class OperationUpdatePage {
    PageTitle = element(by.css('h2#jhi-operation-heading'));
    saveButton = element(by.css('#save-entity'));
    cancelButton = element(by.css('#cancel-save'));
    dateInput = element(by.css('input#field_date'));
    descriptionInput = element(by.css('input#field_description'));
    amountInput = element(by.css('input#field_amount'));
    bankAccountSelect = element(by.css('select#field_bankAccount'));
    labelSelect = element(by.css('select#field_label'));

    getPageTitle() {
        return this.PageTitle.getAttribute('jhiTranslate');
    }

    setDateInput(date) {
        this.dateInput.sendKeys(date);
    }

    getDateInput() {
        return this.dateInput.getAttribute('value');
    }

    setDescriptionInput(description) {
        this.descriptionInput.sendKeys(description);
    }

    getDescriptionInput() {
        return this.descriptionInput.getAttribute('value');
    }

    setAmountInput(amount) {
        this.amountInput.sendKeys(amount);
    }

    getAmountInput() {
        return this.amountInput.getAttribute('value');
    }

    bankAccountSelectLastOption() {
        this.bankAccountSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    bankAccountSelectOption(option) {
        this.bankAccountSelect.sendKeys(option);
    }

    getBankAccountSelect() {
        return this.bankAccountSelect;
    }

    getBankAccountSelectedOption() {
        return this.bankAccountSelect.element(by.css('option:checked')).getText();
    }

    labelSelectLastOption() {
        this.labelSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    labelSelectOption(option) {
        this.labelSelect.sendKeys(option);
    }

    getLabelSelect() {
        return this.labelSelect;
    }

    getLabelSelectedOption() {
        return this.labelSelect.element(by.css('option:checked')).getText();
    }

    save() {
        this.saveButton.click();
    }

    cancel() {
        this.cancelButton.click();
    }

    getSaveButton() {
        return this.saveButton;
    }
}
