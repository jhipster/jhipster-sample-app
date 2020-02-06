import { browser, element, by, ExpectedConditions as ec } from 'protractor';

import { NavBarPage, SignInPage, PasswordPage, SettingsPage } from '../page-objects/jhi-page-objects';

const expect = chai.expect;

describe('account', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let passwordPage: PasswordPage;
  let settingsPage: SettingsPage;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage(true);
  });

  it('should fail to login with bad password', async () => {
    const expect1 = 'home.title';
    const value1 = await element(by.css('h1')).getAttribute('jhiTranslate');
    expect(value1).to.eq(expect1);
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'foo');

    const expect2 = 'login.messages.error.authentication';
    const value2 = await element(by.css('.alert-danger')).getAttribute('jhiTranslate');
    expect(value2).to.eq(expect2);
  });

  it('should login successfully with admin account', async () => {
    await browser.get('/');
    signInPage = await navBarPage.getSignInPage();

    const expect1 = 'global.form.username.label';
    const value1 = await element(by.className('username-label')).getAttribute('jhiTranslate');
    expect(value1).to.eq(expect1);
    await signInPage.autoSignInUsing('admin', 'admin');

    const expect2 = 'home.logged.message';
    await browser.wait(ec.visibilityOf(element(by.id('home-logged-message'))));
    const value2 = await element(by.id('home-logged-message')).getAttribute('jhiTranslate');
    expect(value2).to.eq(expect2);
  });

  it('should be able to update settings', async () => {
    settingsPage = await navBarPage.getSettingsPage();

    const expect1 = 'settings.title';
    const value1 = await settingsPage.getTitle();
    expect(value1).to.eq(expect1);
    await settingsPage.save();

    const expect2 = 'settings.messages.success';
    const alert = element(by.css('.alert-success'));
    const value2 = await alert.getAttribute('jhiTranslate');
    expect(value2).to.eq(expect2);
  });

  it('should fail to update password when using incorrect current password', async () => {
    passwordPage = await navBarPage.getPasswordPage();

    expect(await passwordPage.getTitle()).to.eq('password.title');

    await passwordPage.setCurrentPassword('wrong_current_password');
    await passwordPage.setPassword('new_password');
    await passwordPage.setConfirmPassword('new_password');
    await passwordPage.save();

    const expect2 = 'password.messages.error';
    const alert = element(by.css('.alert-danger'));
    const value2 = await alert.getAttribute('jhiTranslate');
    expect(value2).to.eq(expect2);
    settingsPage = await navBarPage.getSettingsPage();
  });

  it('should be able to update password', async () => {
    passwordPage = await navBarPage.getPasswordPage();

    expect(await passwordPage.getTitle()).to.eq('password.title');

    await passwordPage.setCurrentPassword('admin');
    await passwordPage.setPassword('newpassword');
    await passwordPage.setConfirmPassword('newpassword');
    await passwordPage.save();

    const successMsg = 'password.messages.success';
    const alert = element(by.css('.alert-success'));
    const alertValue = await alert.getAttribute('jhiTranslate');
    expect(alertValue).to.eq(successMsg);
    await navBarPage.autoSignOut();
    await navBarPage.goToSignInPage();
    await signInPage.autoSignInUsing('admin', 'newpassword');

    // change back to default
    await navBarPage.goToPasswordMenu();
    await passwordPage.setCurrentPassword('newpassword');
    await passwordPage.setPassword('admin');
    await passwordPage.setConfirmPassword('admin');
    await passwordPage.save();

    // wait for success message
    const alertValue2 = await alert.getAttribute('jhiTranslate');
    expect(alertValue2).to.eq(successMsg);
  });

  it('should navigate to 404 not found error page on non existing route and show user own navbar if valid authentication exists', async () => {
    // don't sign out and refresh page with non existing route
    await browser.get('/this-is-link-to-non-existing-page');

    // should navigate to 404 not found page
    const url = await browser.getCurrentUrl();
    expect(url).to.endWith('404');

    // as user is admin then should show admin menu to user
    await navBarPage.clickOnAdminMenu();
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
