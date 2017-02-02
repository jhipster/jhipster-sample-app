'use strict';
describe('account', function () {

    var username = element(by.id('username'));
    var password = element(by.id('password'));
    var accountMenu = element(by.id('account-menu'));
    var login = element(by.id('login'));
    var logout = element(by.id('logout'));

    beforeAll(function () {
        browser.get('/');
    });

    it('should fail to login with bad password', function () {
        const expect1 = /home.title/;
        element.all(by.css('h1')).first().getAttribute('data-translate').then((value) => {
            expect(value).toMatch(expect1);
        });
        accountMenu.click();
        login.click();

        username.sendKeys('admin');
        password.sendKeys('foo');
        element(by.css('button[type=submit]')).click();

        const expect2 = /login.messages.error.authentication/;
        element.all(by.css('.alert-danger')).first().getAttribute('data-translate').then((value) => {
            expect(value).toMatch(expect2);
        });
    });

    it('should login successfully with admin account', function () {
        const expect1 = /login.title/;
        element.all(by.css('h1')).first().getAttribute('data-translate').then((value) => {
            expect(value).toMatch(expect1);
        });

        username.clear().sendKeys('admin');
        password.clear().sendKeys('admin');
        element(by.css('button[type=submit]')).click();

        const expect2 = /home.logged.message/;
        element.all(by.css('.alert-success')).getAttribute('data-translate').then((value) => {
            expect(value).toMatch(expect2);
        });
    });

    it('should be able to update settings', function () {
        accountMenu.click();
        element(by.css('[ui-sref="settings"]')).click();

        const expect1 = /settings.title/;
        element.all(by.css('h2')).first().getAttribute('data-translate').then((value) => {
            expect(value).toMatch(expect1);
        });
        element(by.css('button[type=submit]')).click();

        const expect2 = /settings.messages.success/;
        element.all(by.css('.alert-success')).first().getAttribute('data-translate').then((value) => {
            expect(value).toMatch(expect2);
        });
    });

    it('should be able to update password', function () {
        accountMenu.click();
        element(by.css('[ui-sref="password"]')).click();

        const expect1 = /password.title/;
        element.all(by.css('h2')).first().getAttribute('data-translate').then((value) => {
            expect(value).toMatch(expect1);
        });
        password.sendKeys('newpassword');
        element(by.id('confirmPassword')).sendKeys('newpassword');
        element(by.css('button[type=submit]')).click();

        const expect2 = /password.messages.success/;
        element.all(by.css('.alert-success')).first().getAttribute('data-translate').then((value) => {
            expect(value).toMatch(expect2);
        });
        accountMenu.click();
        logout.click();

        accountMenu.click();
        login.click();

        username.sendKeys('admin');
        password.sendKeys('newpassword');
        element(by.css('button[type=submit]')).click();

        accountMenu.click();
        element(by.css('[ui-sref="password"]')).click();
        // change back to default
        password.clear().sendKeys('admin');
        element(by.id('confirmPassword')).clear().sendKeys('admin');
        element(by.css('button[type=submit]')).click();
    });

    afterAll(function () {
        accountMenu.click();
        logout.click();
    });
});
