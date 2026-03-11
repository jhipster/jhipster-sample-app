/* eslint-disable @typescript-eslint/no-namespace */

import {
  accountMenuSelector,
  adminMenuSelector,
  entityItemSelector,
  loginItemSelector,
  logoutItemSelector,
  navbarSelector,
  passwordItemSelector,
  registerItemSelector,
  settingsItemSelector,
} from './commands';

Cypress.Commands.add('clickOnLoginItem', () => {
  cy.get(navbarSelector).find(accountMenuSelector).click();
  return cy.get(navbarSelector).find(accountMenuSelector).find(loginItemSelector).click();
});

Cypress.Commands.add('clickOnLogoutItem', () => {
  cy.get(navbarSelector).find(accountMenuSelector).click();
  return cy.get(navbarSelector).find(accountMenuSelector).find(logoutItemSelector).click();
});

Cypress.Commands.add('clickOnRegisterItem', () => {
  cy.get(navbarSelector).find(accountMenuSelector).click();
  return cy.get(navbarSelector).find(accountMenuSelector).find(registerItemSelector).click();
});

Cypress.Commands.add('clickOnSettingsItem', () => {
  cy.get(navbarSelector).find(accountMenuSelector).click();
  return cy.get(navbarSelector).find(accountMenuSelector).find(settingsItemSelector).click();
});

Cypress.Commands.add('clickOnPasswordItem', () => {
  cy.get(navbarSelector).find(accountMenuSelector).click();
  return cy.get(navbarSelector).find(accountMenuSelector).find(passwordItemSelector).click();
});

Cypress.Commands.add('clickOnAdminMenuItem', (item: string) => {
  cy.get(navbarSelector).find(adminMenuSelector).click();
  return cy.get(navbarSelector).find(adminMenuSelector).find(`.dropdown-item[href="/${item}"]`).click();
});

Cypress.Commands.add('clickOnEntityMenuItem', (entityName: string) => {
  cy.get(navbarSelector).find(entityItemSelector).click();
  return cy.get(navbarSelector).find(entityItemSelector).find(`.dropdown-item[href="/${entityName}"]`).click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      clickOnLoginItem(): Cypress.Chainable;
      clickOnLogoutItem(): Cypress.Chainable;
      clickOnRegisterItem(): Cypress.Chainable;
      clickOnSettingsItem(): Cypress.Chainable;
      clickOnPasswordItem(): Cypress.Chainable;
      clickOnAdminMenuItem(item: string): Cypress.Chainable;
      clickOnEntityMenuItem(entityName: string): Cypress.Chainable;
    }
  }
}

// Convert this to a module instead of a script (allows import/export)
export {};
