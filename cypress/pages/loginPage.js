// cypress/pages/loginPage.js

class LoginPage {
    visit() {
        cy.visit('http://localhost:9090/web/login.html');
    }

    fillUsername(username) {
        cy.get('#username').type(username);
    }

    fillPassword(password) {
        cy.get('#password').type(password);
    }

    submit() {
        cy.get('#loginBtn').click();
    }

    verifyLoginSuccess() {
        cy.get('.success').should('be.visible');
    }

    verifyLoginSuccess() {
        cy.url().should('include', `/optionsPage.html `);
    }
}

export default new LoginPage();
