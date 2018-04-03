import { element, by } from 'protractor';

export class BankAccountComponentsPage {
  createButton = element(by.css('#jh-create-entity'));
  title = element.all(by.css('jhi-bank-account div h2#page-heading span')).first();

  clickOnCreateButton() {
    return this.createButton.click();
  }

  getTitle() {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class BankAccountUpdatePage {
  PageTitle = element(by.css('h2#jhi-bank-account-heading'));
  saveButton = element(by.css('#save-entity'));
  cancelButton = element(by.css('#cancel-save'));
  nameInput = element(by.css('input#field_name'));
  balanceInput = element(by.css('input#field_balance'));
  userSelect = element(by.css('select#field_user'));

  getPageTitle() {
    return this.PageTitle.getAttribute('jhiTranslate');
  }

  setNameInput(name) {
    this.nameInput.sendKeys(name);
  }

  getNameInput() {
    return this.nameInput.getAttribute('value');
  }

  setBalanceInput(balance) {
    this.balanceInput.sendKeys(balance);
  }

  getBalanceInput() {
    return this.balanceInput.getAttribute('value');
  }

  userSelectLastOption() {
    this.userSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  userSelectOption(option) {
    this.userSelect.sendKeys(option);
  }

  getUserSelect() {
    return this.userSelect;
  }

  getUserSelectedOption() {
    return this.userSelect.element(by.css('option:checked')).getText();
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
