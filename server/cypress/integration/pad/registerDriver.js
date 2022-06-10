//turn off application errors due to poor framework
Cypress.on("uncaught:exception", (err, runnable) => {
    //returning false here prevents Cypress from failing the test
    return false;
})

//Context: Login
describe("Register, creating deliverer account", () => {

    //Run before each test in this context
        beforeEach(() => {
            //Go to the specified URL
            cy.visit("http://localhost:8080");

        });

        //Test: Validate sign up form
        it("Valid sign up form", () => {
            //Find the field for the firstname, check if it exists.
            cy.get("#inputFirstName").should("exist");

            //Find the field for the surname, check if it exists.
            cy.get("#inputSurname").should("exist");

            //Find the field for the email, check if it exists.
            cy.get("#inputEmail").should("exist");

            //Find the field for the password, check if it exists.
            cy.get("#inputPassword").should("exist");

            //Find the field for the address, check if it exists.
            cy.get("#inputAdress").should("exist");

            //Find the field for the phonenumber, check if it exists.
            cy.get("#inputPhonenumber").should("exist");

            //Find the form for the place, check if it exists.
            cy.get("#inputResidence").should("exist");

            //Find the field for the zip, check if it exists.
            cy.get("#inputPostcode").should("exist");

            //Find the checkbox for the t&c, check if it exists.
            cy.get("#save-info").should("exist");

            //Find the sign up button, check if it exists.
            cy.get("#saveAccountBtn").should("exist");

            //The error should be hidden.
            cy.get(".error").should("be.hidden");
        });

        //Test: Fill in form incorrectly which gives an error
    it("Valid sign up, see if the alerts work", () => {
        //Find the field for the firstname, check if it exists.
        cy.get("#inputFirstName").type("Joy", { force: true });

        //Find the field for the surname, check if it exists.
        cy.get("#inputSurname").type("Park", { force: true });

        //Find the sign up button, check if it exists.
        cy.get("#saveAccountBtn").click({ force: true });

        //Find the error that occurs when a field is not filled in.
        cy.get(".error").should("be.visible");


    });

    //Test: Fill in form correctly
    it("Valid sign up, fill in the form correctly to see if you can sign up", () => {
        //Find the field for the firstname, check if it exists.
        cy.get("#inputFirstName").type("Joy", { force: true });

        //Find the field for the surname, check if it exists.
        cy.get("#inputSurname").type("Park", { force: true });

        //Find the field for the email, check if it exists.
        cy.get("#inputEmail").type("joy@gmail.com", { force: true });

        //Find the field for the password, check if it exists.
        cy.get("#inputPassword").type("Test1234@", { force: true });

        //Find the field for the address, check if it exists.
        cy.get("#inputAdress").type("Weesperplein 11", { force: true });

        //Find the field for the phonenumber, check if it exists.
        cy.get("#inputPhonenumber").type("+31612435966", { force: true });

        //Find the form for the place, check if it exists.
        cy.get('#inputResidence').select('Amsterdam', { force: true });
        //Select Amsterdam.



        //Find the field for the zip, check if it exists.
        cy.get("#inputPostcode").type("1018WZ", { force: true });

        //Find the checkbox for the t&c, check if it exists.
        cy.get("#save-info").click({ force: true });

        //Find the sign up button, check if it exists.
        cy.get("#saveAccountBtn").click({ force: true });


        cy.wait(1000);

        //Find the input for the username, check if it exists.
        cy.get("#exampleInputUsername").should("exist");
        //Find the input for the password, check if it exists.
        cy.get("#exampleInputPassword").should("exist");
    });

});
