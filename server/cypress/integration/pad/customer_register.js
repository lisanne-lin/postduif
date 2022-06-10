// turn off application errors due to framework
Cypress.on("uncaught:exception", (err, runnable) => {
	// returning false here prevents Cypress from
	// failing the test
	return false;
});

describe("Register, creating customer account", () => {
	it("Goes to homepage, then sign up page", () => {
		cy.visit("http://localhost:8080");

		cy.wait(1000);

		cy.get("#sign-up-btn").click({ force: true });
	});

	it("fill in form", () => {
		cy.get("#exampleInputNaamEigenaar").type("Lisanne", { force: true });
		cy.get("#exampleInputAchternaam").type("Lin", { force: true });
		cy.get("#exampleInputNaamOnderneming").type("Lisanne's bapao", {
			force: true,
		});
		cy.get("#exampleInputEmail").type("linlisanne@hotmail.com", {
			force: true,
		});
		cy.get("#exampleInputPassword").type("Test123!", { force: true });
		cy.get("#exampleInputAdress").type("Van almondelaan 37", {
			force: true,
		});
		cy.get("#exampleInputPhonenumber").type("0612345678", { force: true });
		cy.get("#exampleInputResidence").select("Tilburg", { force: true });
		cy.get("#exampleInputPostcode").type("1215PC", { force: true });
		cy.get('[type="checkbox"]').check({ force: true });
		cy.get("#saveAccountBtn").click({ force: true });
	});
});
