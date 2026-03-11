import {
  configurationPageHeadingSelector,
  healthPageHeadingSelector,
  logsPageHeadingSelector,
  metricsPageHeadingSelector,
  swaggerFrameSelector,
  swaggerPageSelector,
} from '../../support/commands';

describe('/admin', () => {
  let adminUsername;
  let adminPassword;

  before(() => {
    cy.credentials().then(credentials => {
      ({ adminUsername, adminPassword } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(adminUsername, adminPassword);
    cy.visit('');
  });

  describe('/metrics', () => {
    it('should load the page', () => {
      cy.clickOnAdminMenuItem('admin/metrics');
      cy.get(metricsPageHeadingSelector).should('be.visible');
    });
  });

  describe('/health', () => {
    it('should load the page', () => {
      cy.clickOnAdminMenuItem('admin/health');
      cy.get(healthPageHeadingSelector).should('be.visible');
    });
  });

  describe('/logs', () => {
    it('should load the page', () => {
      cy.clickOnAdminMenuItem('admin/logs');
      cy.get(logsPageHeadingSelector).should('be.visible');
    });
  });

  describe('/configuration', () => {
    it('should load the page', () => {
      cy.clickOnAdminMenuItem('admin/configuration');
      cy.get(configurationPageHeadingSelector).should('be.visible');
    });
  });

  describe('/docs', () => {
    it('should load the page', () => {
      cy.getManagementInfo().then(info => {
        if (info.activeProfiles.includes('api-docs')) {
          cy.clickOnAdminMenuItem('admin/docs');
          cy.get(swaggerFrameSelector)
            .should('be.visible')
            .then(() => {
              // Wait iframe to load
              cy.wait(500); // eslint-disable-line cypress/no-unnecessary-waiting
              const getSwaggerIframe = () => {
                return cy.get(swaggerFrameSelector).its('0.contentDocument.body').should('not.be.empty').then(cy.wrap);
              };
              getSwaggerIframe().find(swaggerPageSelector, { timeout: 15000 }).should('be.visible');
              getSwaggerIframe().find('[id="select"] > option').its('length').should('be.gt', 0);
              getSwaggerIframe().find(swaggerPageSelector).then(cy.wrap).find('.information-container').its('length').should('be.gt', 0);
            });
        }
      });
    });
  });
});
