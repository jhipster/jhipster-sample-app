'use strict';

describe('administration', function () {

    var username = element(by.id('username'));
    var password = element(by.id('password'));
    var accountMenu = element(by.id('account-menu'));
    var adminMenu = element(by.id('admin-menu'));
    var login = element(by.id('login'));
    var logout = element(by.id('logout'));

    beforeAll(function () {
        browser.get('/');

        accountMenu.click();
        login.click();

        username.sendKeys('admin');
        password.sendKeys('admin');
        element(by.css('button[type=submit]')).click();
    });

    beforeEach(function () {
        adminMenu.click();
    });

    it('should load user management', function () {
        element(by.css('[ui-sref="user-management"]')).click();
        const expect1 = /userManagement.home.title/;
        element.all(by.css('h2')).first().getAttribute('data-translate').then((value) => {
            expect(value).toMatch(expect1);
        });
    });

    it('should load metrics', function () {
        element(by.css('[ui-sref="jhi-metrics"]')).click();
        const expect1 = /metrics.title/;
        element.all(by.css('h2')).first().getAttribute('data-translate').then((value) => {
            expect(value).toMatch(expect1);
        });
    });

    it('should load health', function () {
        element(by.css('[ui-sref="jhi-health"]')).click();
        const expect1 = /health.title/;
        element.all(by.css('h2')).first().getAttribute('data-translate').then((value) => {
            expect(value).toMatch(expect1);
        });
    });

    it('should load configuration', function () {
        element(by.css('[ui-sref="jhi-configuration"]')).click();
        const expect1 = /configuration.title/;
        element.all(by.css('h2')).first().getAttribute('data-translate').then((value) => {
            expect(value).toMatch(expect1);
        });
    });

    it('should load audits', function () {
        element(by.css('[ui-sref="audits"]')).click();
        const expect1 = /audits.title/;
        element.all(by.css('h2')).first().getAttribute('data-translate').then((value) => {
            expect(value).toMatch(expect1);
        });
    });

    it('should load logs', function () {
        element(by.css('[ui-sref="logs"]')).click();
        const expect1 = /logs.title/;
        element.all(by.css('h2')).first().getAttribute('data-translate').then((value) => {
            expect(value).toMatch(expect1);
        });
    });

    afterAll(function () {
        accountMenu.click();
        logout.click();
    });
});
