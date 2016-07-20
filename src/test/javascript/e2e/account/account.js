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
        expect(element.all(by.css('h1')).first().getAttribute("translate")).toMatch(/home.title/);
        accountMenu.click();
        login.click();

        username.sendKeys('admin');
        password.sendKeys('foo');
        element(by.css('button[type=submit]')).click();

        expect(element(by.css('.alert-danger')).getAttribute("translate")).toMatch(/login.messages.error.authentication/);
    });

    it('should login successfully with admin account', function () {
        expect(element.all(by.css('h1')).first().getText()).toMatch(/Sign in/);

        username.clear().sendKeys('admin');
        password.clear().sendKeys('admin');
        element(by.css('button[type=submit]')).click();

        expect(element(by.css('.alert-success')).getAttribute("translate")).toMatch(/home.logged.message/);
    });

    it('should be able to update settings', function () {
        accountMenu.click();
        element(by.css('[ui-sref="settings"]')).click();

        expect(element(by.css('h2')).getAttribute("translate")).toMatch(/settings.title/);
        element(by.css('button[type=submit]')).click();

        expect(element(by.css('.alert-success')).getAttribute("translate")).toMatch(/settings.messages.success/);
    });

    it('should be able to update password', function () {
        accountMenu.click();
        element(by.css('[ui-sref="password"]')).click();

        expect(element.all(by.css('h2')).first().getAttribute("translate")).toMatch(/password.title/);
        password.sendKeys('newpassword');
        element(by.id('confirmPassword')).sendKeys('newpassword');
        element(by.css('button[type=submit]')).click();

        expect(element(by.css('.alert-success')).getAttribute("translate")).toMatch(/password.messages.success/);
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
