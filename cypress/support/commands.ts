declare namespace Cypress {
  interface Chainable {
    login(): Chainable<void>;
    logout(): Chainable<void>;
  }
}

Cypress.Commands.add('login', () => {
  cy.intercept('POST', '**/api/auth/login', {
    fixture: 'login.json'
  }).as('loginRequest');

  cy.visit('/login');
  cy.get('[name=email]').type('test@example.com');
  cy.get('[name=password]').type('password');
  cy.get('button[type=submit]').click();
  cy.wait('@loginRequest');
});

Cypress.Commands.add('logout', () => {
  cy.visit('/profile');
  cy.get('button').contains('Выход').should('exist').click();
  cy.intercept('POST', '**/api/auth/logout', {
    statusCode: 200,
    body: { success: true }
  }).as('logoutRequest');
  cy.wait('@logoutRequest');
});
