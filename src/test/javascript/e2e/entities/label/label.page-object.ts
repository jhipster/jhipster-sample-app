import { element, by } from 'protractor';

export class LabelComponentsPage {
  createButton = element(by.css('#jh-create-entity'));
  title = element.all(by.css('jhi-label div h2#page-heading span')).first();

  clickOnCreateButton() {
    return this.createButton.click();
  }

  getTitle() {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class LabelUpdatePage {
  PageTitle = element(by.css('h2#jhi-label-heading'));
  saveButton = element(by.css('#save-entity'));
  cancelButton = element(by.css('#cancel-save'));
  labelInput = element(by.css('input#field_label'));

  getPageTitle() {
    return this.PageTitle.getAttribute('jhiTranslate');
  }

  setLabelInput(label) {
    this.labelInput.sendKeys(label);
  }

  getLabelInput() {
    return this.labelInput.getAttribute('value');
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
