import { element, by, ElementFinder } from 'protractor';

export class NavBarPage {
  entityMenu = element(by.id('entity-menu'));
  accountMenu = element(by.id('account-menu'));
  adminMenu: ElementFinder;
  signIn = element(by.id('login'));
  register = element(by.css('[routerLink="register"]'));
  signOut = element(by.id('logout'));
  passwordMenu = element(by.css('[routerLink="password"]'));
  settingsMenu = element(by.css('[routerLink="settings"]'));

  constructor(asAdmin?: Boolean) {
    if (asAdmin) {
      this.adminMenu = element(by.id('admin-menu'));
    }
  }

  async clickOnEntityMenu() {
    await this.entityMenu.click();
  }

  async clickOnAccountMenu() {
    await this.accountMenu.click();
  }

  async clickOnAdminMenu() {
    await this.adminMenu.click();
  }

  async clickOnSignIn() {
    await this.signIn.click();
  }

  async clickOnRegister() {
    await this.signIn.click();
  }

  async clickOnSignOut() {
    await this.signOut.click();
  }

  async clickOnPasswordMenu() {
    await this.passwordMenu.click();
  }

  async clickOnSettingsMenu() {
    await this.settingsMenu.click();
  }

  async clickOnEntity(entityName: string) {
    await element(by.css('[routerLink="' + entityName + '"]')).click();
  }

  async clickOnAdmin(entityName: string) {
    await element(by.css('[routerLink="admin/' + entityName + '"]')).click();
  }

  async getSignInPage() {
    await this.clickOnAccountMenu();
    await this.clickOnSignIn();
    return new SignInPage();
  }
  async getPasswordPage() {
    await this.clickOnAccountMenu();
    await this.clickOnPasswordMenu();
    return new PasswordPage();
  }

  async getSettingsPage() {
    await this.clickOnAccountMenu();
    await this.clickOnSettingsMenu();
    return new SettingsPage();
  }

  async goToEntity(entityName: string) {
    await this.clickOnEntityMenu();
    await this.clickOnEntity(entityName);
  }

  async goToSignInPage() {
    await this.clickOnAccountMenu();
    await this.clickOnSignIn();
  }

  async goToPasswordMenu() {
    await this.clickOnAccountMenu();
    await this.clickOnPasswordMenu();
  }

  async autoSignOut() {
    await this.clickOnAccountMenu();
    await this.clickOnSignOut();
  }
}

export class SignInPage {
  username = element(by.id('username'));
  password = element(by.id('password'));
  loginButton = element(by.css('button[type=submit]'));

  async setUserName(username) {
    await this.username.sendKeys(username);
  }

  async getUserName() {
    return this.username.getAttribute('value');
  }

  async clearUserName() {
    await this.username.clear();
  }

  async setPassword(password) {
    await this.password.sendKeys(password);
  }

  async getPassword() {
    return this.password.getAttribute('value');
  }

  async clearPassword() {
    await this.password.clear();
  }

  async autoSignInUsing(username: string, password: string) {
    await this.setUserName(username);
    await this.setPassword(password);
    await this.login();
  }

  async login() {
    await this.loginButton.click();
  }
}
export class PasswordPage {
  currentPassword = element(by.id('currentPassword'));
  password = element(by.id('newPassword'));
  confirmPassword = element(by.id('confirmPassword'));
  saveButton = element(by.css('button[type=submit]'));
  title = element.all(by.css('h2')).first();

  async setCurrentPassword(password) {
    await this.currentPassword.sendKeys(password);
  }

  async setPassword(password) {
    await this.password.sendKeys(password);
  }

  async getPassword() {
    return this.password.getAttribute('value');
  }

  async clearPassword() {
    await this.password.clear();
  }

  async setConfirmPassword(confirmPassword) {
    await this.confirmPassword.sendKeys(confirmPassword);
  }

  async getConfirmPassword() {
    return this.confirmPassword.getAttribute('value');
  }

  async clearConfirmPassword() {
    await this.confirmPassword.clear();
  }

  async getTitle() {
    return this.title.getAttribute('jhiTranslate');
  }

  async save() {
    await this.saveButton.click();
  }
}

export class SettingsPage {
  firstName = element(by.id('firstName'));
  lastName = element(by.id('lastName'));
  email = element(by.id('email'));
  saveButton = element(by.css('button[type=submit]'));
  title = element.all(by.css('h2')).first();

  async setFirstName(firstName) {
    await this.firstName.sendKeys(firstName);
  }

  async getFirstName() {
    return this.firstName.getAttribute('value');
  }

  async clearFirstName() {
    await this.firstName.clear();
  }

  async setLastName(lastName) {
    await this.lastName.sendKeys(lastName);
  }

  async getLastName() {
    return this.lastName.getAttribute('value');
  }

  async clearLastName() {
    await this.lastName.clear();
  }

  async setEmail(email) {
    await this.email.sendKeys(email);
  }

  async getEmail() {
    return this.email.getAttribute('value');
  }

  async clearEmail() {
    await this.email.clear();
  }

  async getTitle() {
    return this.title.getAttribute('jhiTranslate');
  }

  async save() {
    await this.saveButton.click();
  }
}
