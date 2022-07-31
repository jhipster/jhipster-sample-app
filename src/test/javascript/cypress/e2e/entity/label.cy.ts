import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Label e2e test', () => {
  const labelPageUrl = '/label';
  const labelPageUrlPattern = new RegExp('/label(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const labelSample = { label: 'input bypass' };

  let label;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/labels+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/labels').as('postEntityRequest');
    cy.intercept('DELETE', '/api/labels/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (label) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/labels/${label.id}`,
      }).then(() => {
        label = undefined;
      });
    }
  });

  it('Labels menu should load Labels page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('label');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Label').should('exist');
    cy.url().should('match', labelPageUrlPattern);
  });

  describe('Label page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(labelPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Label page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/label/new$'));
        cy.getEntityCreateUpdateHeading('Label');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', labelPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/labels',
          body: labelSample,
        }).then(({ body }) => {
          label = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/labels+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [label],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(labelPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Label page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('label');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', labelPageUrlPattern);
      });

      it('edit button click should load edit Label page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Label');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', labelPageUrlPattern);
      });

      it('edit button click should load edit Label page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Label');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', labelPageUrlPattern);
      });

      it('last delete button click should delete instance of Label', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('label').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', labelPageUrlPattern);

        label = undefined;
      });
    });
  });

  describe('new Label page', () => {
    beforeEach(() => {
      cy.visit(`${labelPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Label');
    });

    it('should create an instance of Label', () => {
      cy.get(`[data-cy="label"]`).type('Synergized').should('have.value', 'Synergized');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        label = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', labelPageUrlPattern);
    });
  });
});
