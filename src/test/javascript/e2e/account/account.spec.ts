import { browser, element, by } from 'protractor';
import { NavBarPage, SignInPage, PasswordPage, SettingsPage } from './../page-objects/jhi-page-objects';

describe('account', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let passwordPage: PasswordPage;
  let settingsPage: SettingsPage;

  beforeAll(() => {
    browser.get('/');
    browser.waitForAngular();
    navBarPage = new NavBarPage(true);
    browser.waitForAngular();
  });

  it('should fail to login with bad password', () => {
    const expect1 = /home.title/;
    element
      .all(by.css('h1'))
      .first()
      .getAttribute('jhiTranslate')
      .then(value => {
        expect(value).toMatch(expect1);
      });
    signInPage = navBarPage.getSignInPage();
    signInPage.autoSignInUsing('admin', 'foo');

    const expect2 = /login.messages.error.authentication/;
    element
      .all(by.css('.alert-danger'))
      .first()
      .getAttribute('jhiTranslate')
      .then(value => {
        expect(value).toMatch(expect2);
      });
  });

  it('should login successfully with admin account', () => {
    const expect1 = /global.form.username/;
    element
      .all(by.css('.modal-content label'))
      .first()
      .getAttribute('jhiTranslate')
      .then(value => {
        expect(value).toMatch(expect1);
      });
    signInPage.clearUserName();
    signInPage.setUserName('admin');
    signInPage.clearPassword();
    signInPage.setPassword('admin');
    signInPage.login();

    browser.waitForAngular();

    const expect2 = /home.logged.message/;
    element
      .all(by.css('.alert-success span'))
      .getAttribute('jhiTranslate')
      .then(value => {
        expect(value).toMatch(expect2);
      });
  });
  it('should be able to update settings', () => {
    settingsPage = navBarPage.getSettingsPage();

    const expect1 = /settings.title/;
    settingsPage.getTitle().then(value => {
      expect(value).toMatch(expect1);
    });
    settingsPage.save();

    const expect2 = /settings.messages.success/;
    element
      .all(by.css('.alert-success'))
      .first()
      .getAttribute('jhiTranslate')
      .then(value => {
        expect(value).toMatch(expect2);
      });
  });

  it('should fail to update password when using incorrect current password', () => {
    passwordPage = navBarPage.getPasswordPage();

    expect(passwordPage.getTitle()).toMatch(/password.title/);

    passwordPage.setCurrentPassword('wrong_current_password');
    passwordPage.setPassword('new_password');
    passwordPage.setConfirmPassword('new_password');
    passwordPage.save();

    const expect2 = /password.messages.error/;
    element
      .all(by.css('.alert-danger'))
      .first()
      .getAttribute('jhiTranslate')
      .then(value => {
        expect(value).toMatch(expect2);
      });
    settingsPage = navBarPage.getSettingsPage();
  });

  it('should be able to update password', () => {
    passwordPage = navBarPage.getPasswordPage();

    expect(passwordPage.getTitle()).toMatch(/password.title/);

    passwordPage.setCurrentPassword('admin');
    passwordPage.setPassword('newpassword');
    passwordPage.setConfirmPassword('newpassword');
    passwordPage.save();

    const expect2 = /password.messages.success/;
    element
      .all(by.css('.alert-success'))
      .first()
      .getAttribute('jhiTranslate')
      .then(value => {
        expect(value).toMatch(expect2);
      });
    navBarPage.autoSignOut();
    navBarPage.goToSignInPage();
    signInPage.autoSignInUsing('admin', 'newpassword');

    // change back to default
    navBarPage.goToPasswordMenu();
    passwordPage.setCurrentPassword('newpassword');
    passwordPage.setPassword('admin');
    passwordPage.setConfirmPassword('admin');
    passwordPage.save();
  });

  afterAll(() => {
    navBarPage.autoSignOut();
  });
});
