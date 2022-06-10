// turn off application errors due to framework
Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
});

describe("Register, creating client account", () => {
    it("Goes to homepage, then sign up page for clients", () => {
        cy.visit("http://localhost:8080");

        cy.wait(1000);

        cy.get("#sign-up-btn-client").click({ force: true });
    });

    it("fill in form, and sign up", () => {
        cy.get("#exampleInputNaamEigenaar").type("Simon", { force: true });
        cy.get("#exampleInputAchternaam").type("Vriesema", { force: true });
        cy.get("#exampleInputEmail").type("simon.vriesema@hva.nl", {
            force: true,
        });
        cy.get("#exampleInputPassword").type("SimonVriesema2001!", {
            force: true,
        });
        cy.get("#exampleInputAdress").type("Uilenstede 150", { force: true });
        cy.get("#exampleInputPhonenumber").type("+31612345678", {
            force: true,
        });
        cy.get("#exampleInputResidence").select("Amstelveen", { force: true });
        cy.get("#exampleInputPostcode").type("1183AN", { force: true });
        cy.get("#saveAccountBtn").click({ force: true });
    });
});
