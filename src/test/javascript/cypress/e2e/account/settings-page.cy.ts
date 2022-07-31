import { firstNameSettingsSelector, lastNameSettingsSelector, submitSettingsSelector, emailSettingsSelector } from '../../support/commands';

describe('/account/settings', () => {
  const adminUsername = Cypress.env('E2E_USERNAME') ?? 'admin';
  const adminPassword = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';

  beforeEach(() => {
    cy.login(username, password);
    cy.visit('/account/settings');
  });

  beforeEach(() => {
    cy.intercept('POST', '/api/account').as('settingsSave');
  });

  it('should be accessible through menu', () => {
    cy.visit('');
    cy.clickOnSettingsItem();
    cy.url().should('match', /\/account\/settings$/);
  });

  it("should be able to change 'user' firstname settings", () => {
    cy.get(firstNameSettingsSelector).clear().type('jhipster');
    // need to modify email because default email does not match regex in vue
    cy.get(emailSettingsSelector).clear().type('user@localhost.fr');
    cy.get(submitSettingsSelector).click();
    cy.wait('@settingsSave').then(({ response }) => expect(response.statusCode).to.equal(200));
  });

  it("should be able to change 'user' lastname settings", () => {
    cy.get(lastNameSettingsSelector).clear().type('retspihj');
    // need to modify email because default email does not match regex in vue
    cy.get(emailSettingsSelector).clear().type('user@localhost.fr');
    cy.get(submitSettingsSelector).click();
    cy.wait('@settingsSave').then(({ response }) => expect(response.statusCode).to.equal(200));
  });

  it("should be able to change 'user' email settings", () => {
    cy.get(emailSettingsSelector).clear().type('user@localhost.fr');
    cy.get(submitSettingsSelector).click();
    cy.wait('@settingsSave').then(({ response }) => expect(response.statusCode).to.equal(200));
  });

  describe('if there is another user with an email', () => {
    before(() => {
      cy.login(adminUsername, adminPassword);
      cy.visit('/account/settings');
      cy.get(emailSettingsSelector).clear().type('admin@localhost.fr');
      cy.intercept({
        method: 'POST',
        url: '/api/account',
        times: 1,
      }).as('settingsSave');
      cy.get(submitSettingsSelector).click();
      cy.wait('@settingsSave');
    });

    it("should not be able to change 'user' email to same value", () => {
      cy.get(emailSettingsSelector).clear().type('admin@localhost.fr');
      cy.get(submitSettingsSelector).click();
      cy.wait('@settingsSave').then(({ response }) => expect(response.statusCode).to.equal(400));
    });
  });
});
