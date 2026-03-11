import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../../support/entity';

describe('UserManagement e2e test', () => {
  const userManagementPageUrl = '/user-management';
  const userManagementPageUrlPattern = new RegExp('/user-management(\\?.*)?$');
  let username: string;
  let password: string;
  const userManagementSample = { login: 'Georgette79', email: 'Rosie_Pagac93@gmail.com' };

  let userManagement;

  before(() => {
    cy.credentials().then(credentials => {
      ({ adminUsername: username, adminPassword: password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/admin/users+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/admin/users').as('postEntityRequest');
    cy.intercept('DELETE', '/api/admin/users/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (userManagement) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/admin/users/${userManagement.login}`,
      }).then(() => {
        userManagement = undefined;
      });
    }
  });

  it('UserManagements menu should load UserManagements page', () => {
    cy.visit('/');
    cy.clickOnAdminMenuItem('user-management');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserManagement').should('exist');
    cy.url().should('match', userManagementPageUrlPattern);
  });

  describe('UserManagement page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userManagementPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserManagement page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-management/new$'));
        cy.getEntityCreateUpdateHeading('UserManagement');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userManagementPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/admin/users',
          body: userManagementSample,
        }).then(({ body }) => {
          userManagement = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/admin/users+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/admin/users?page=0&size=20>; rel="last",<http://localhost/api/admin/users?page=0&size=20>; rel="first"',
              },
              body: [userManagement],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(userManagementPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details UserManagement page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userManagement');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userManagementPageUrlPattern);
      });

      it('edit button click should load edit UserManagement page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserManagement');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userManagementPageUrlPattern);
      });

      it('edit button click should load edit UserManagement page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserManagement');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userManagementPageUrlPattern);
      });

      it('last delete button click should delete instance of UserManagement', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('userManagement').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userManagementPageUrlPattern);

        userManagement = undefined;
      });
    });
  });

  describe('new UserManagement page', () => {
    beforeEach(() => {
      cy.visit(userManagementPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserManagement');
    });

    it('should create an instance of UserManagement', () => {
      cy.get(`[data-cy="login"]`).type('Juliana14');
      cy.get(`[data-cy="login"]`).should('have.value', 'Juliana14');

      cy.get(`[data-cy="firstName"]`).type('Wm');
      cy.get(`[data-cy="firstName"]`).should('have.value', 'Wm');

      cy.get(`[data-cy="lastName"]`).type('Runolfsdottir');
      cy.get(`[data-cy="lastName"]`).should('have.value', 'Runolfsdottir');

      cy.get(`[data-cy="email"]`).type('Felipe.Grady85@hotmail.com');
      cy.get(`[data-cy="email"]`).should('have.value', 'Felipe.Grady85@hotmail.com');

      cy.get(`[data-cy="langKey"]`).select('en');

      cy.get(`[data-cy="activated"]`).should('be.checked');
      cy.get(`[data-cy="activated"]`).click();
      cy.get(`[data-cy="activated"]`).should('not.be.checked');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        userManagement = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', userManagementPageUrlPattern);
    });
  });
});
