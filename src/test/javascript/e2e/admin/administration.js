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
        element.all(by.css('h2')).first().getAttribute('data-translate').then(function (value) {
            expect(value).toMatch(/userManagement.home.title/);
        });
    });

    it('should load metrics', function () {
        element(by.css('[ui-sref="jhi-metrics"]')).click();
        element.all(by.css('h2')).first().getAttribute('data-translate').then(function (value) {
            expect(value).toMatch(/metrics.title/);
        });
    });

    it('should load health', function () {
        element(by.css('[ui-sref="jhi-health"]')).click();
        element.all(by.css('h2')).first().getAttribute('data-translate').then(function (value) {
            expect(value).toMatch(/health.title/);
        });
    });

    it('should load configuration', function () {
        element(by.css('[ui-sref="jhi-configuration"]')).click();
        element.all(by.css('h2')).first().getAttribute('data-translate').then(function (value) {
            expect(value).toMatch(/configuration.title/);
        });
    });

    it('should load audits', function () {
        element(by.css('[ui-sref="audits"]')).click();
        element.all(by.css('h2')).first().getAttribute('data-translate').then(function (value) {
            expect(value).toMatch(/audits.title/);
        });
    });

    it('should load logs', function () {
        element(by.css('[ui-sref="logs"]')).click();
        element.all(by.css('h2')).first().getAttribute('data-translate').then(function (value) {
            expect(value).toMatch(/logs.title/);
        });
    });

    afterAll(function () {
        accountMenu.click();
        logout.click();
    });
});
