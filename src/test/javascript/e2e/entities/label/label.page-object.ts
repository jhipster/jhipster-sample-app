import { element, by, ElementFinder } from 'protractor';

export class LabelComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    title = element.all(by.css('jhi-label div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class LabelUpdatePage {
    pageTitle = element(by.id('jhi-label-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    labelInput = element(by.id('field_label'));

    async getPageTitle() {
        return this.pageTitle.getAttribute('jhiTranslate');
    }

    async setLabelInput(label) {
        await this.labelInput.sendKeys(label);
    }

    async getLabelInput() {
        return this.labelInput.getAttribute('value');
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}
