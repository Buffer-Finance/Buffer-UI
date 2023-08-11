describe('Test', () => {
  before(() => {
    cy.visit('/');
  });
  it('authenticate test user', () => {
    cy.get('.text-2 > .MuiButtonBase-root').click();
    cy.wait(2000);
    cy.get('[test-id="password-input"]').type('BuffellowsGo!');
    cy.wait(2000);
    cy.get('[test-id="password-submit-button"]').click();
    cy.wait(2000);
    cy.get('[test-id="account-holder-div"]').should('have.text', '0xFbEA');
    cy.get('[test-id="chain-modal"]').click();

    // cy.wait(2000);
    cy.wait(2000);
    cy.get('.ju367v85').click();
    cy.wait(2000);
    cy.get('[test-id="account-holder-div"]').click();
    cy.wait(2000);
    cy.get('[test-id="activate-button-bg"]').click();
    // cy.wait(2000);
    cy.wait(2000);
    cy.get('[test-id="one-ct-creation-button-god"]').click();
    cy.wait(2000);
    cy.get('[test-id="close-button"]').click();
    cy.wait(2000);

    cy.get('[test-id="last-up-btn"]').click();
  });
});
