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
  // Ensure we're on a page where logout is possible
  cy.visit('/profile');

  // More flexible selector for the logout button
  cy.get('button').contains('Выход').should('exist').click();

  // Optional: Wait for logout to complete
  cy.intercept('POST', '**/api/auth/logout', {
    statusCode: 200,
    body: { success: true }
  }).as('logoutRequest');
  cy.wait('@logoutRequest');
});
