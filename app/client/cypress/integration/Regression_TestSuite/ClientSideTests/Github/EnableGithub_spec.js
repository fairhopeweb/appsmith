import adminSettings from "../../../../locators/AdminsSettings";
const commonlocators = require("../../../../locators/commonlocators.json");
import homePage from "../../../../locators/HomePage";

describe("SSO with Github test functionality", function () {
  it("1. Go to admin settings and enable Github with not all mandatory fields filled", function () {
    cy.LogOut();
    cy.LoginFromAPI(Cypress.env("USERNAME"), Cypress.env("PASSWORD"));
    cy.get(".admin-settings-menu-option").should("be.visible");
    cy.get(".admin-settings-menu-option").click();
    cy.url().should("contain", "/settings/general");
    // click authentication tab
    cy.get(adminSettings.authenticationTab).click();
    cy.url().should("contain", "/settings/authentication");
    cy.get(adminSettings.githubButton)
      .should("be.visible")
      .should("contain", "ENABLE");
    cy.get(adminSettings.githubButton).click();
    cy.wait(2000);
    // fill github form
    cy.fillGithubFormPartly();
    cy.get(commonlocators.toastBody).should("be.visible");
    cy.get(commonlocators.toastBody).should(
      "contain",
      "Mandatory fields cannot be empty",
    );
  });

  it("2. Go to admin settings and enable Github", function () {
    cy.LogOut();
    cy.LoginFromAPI(Cypress.env("USERNAME"), Cypress.env("PASSWORD"));
    cy.get(".admin-settings-menu-option").should("be.visible");
    cy.get(".admin-settings-menu-option").click();
    cy.url().should("contain", "/settings/general");
    // click authentication tab
    cy.get(adminSettings.authenticationTab).click();
    cy.url().should("contain", "/settings/authentication");
    cy.get(adminSettings.githubButton)
      .should("be.visible")
      .should("contain", "ENABLE");
    cy.get(adminSettings.githubButton).click();
    cy.wait(2000);
    // fill github form
    cy.fillGithubForm();
    cy.wait(2000);
    // assert server is restarting
    cy.get(adminSettings.restartNotice).should("be.visible");
    // adding wait for server to restart
    cy.wait(120000);
    cy.waitUntil(() => cy.get(homePage.profileMenu).should("be.visible"));
    cy.get(homePage.profileMenu).click();
    cy.get(homePage.signOutIcon).click();
    cy.wait(500);
    // validating sso with github is enabled
    cy.get(adminSettings.loginWithGithub).should(
      "have.text",
      "continue with Github",
    );
  });

  it("3. Go to admin settings and disable Github", function () {
    cy.LogOut();
    cy.LoginFromAPI(Cypress.env("USERNAME"), Cypress.env("PASSWORD"));
    cy.get(".admin-settings-menu-option").should("be.visible");
    cy.get(".admin-settings-menu-option").click();
    cy.url().should("contain", "/settings/general");
    // click authentication tab
    cy.get(adminSettings.authenticationTab).click();
    cy.url().should("contain", "/settings/authentication");
    cy.get(adminSettings.githubButton)
      .should("be.visible")
      .should("contain", "EDIT");
    cy.get(adminSettings.githubButton).click();
    cy.wait(2000);
    cy.get(adminSettings.disconnectBtn)
      .should("be.visible")
      .should("contain", "Disconnect");
    cy.get(adminSettings.disconnectBtn)
      .click()
      .should("contain", "Are you sure?");
    cy.get(adminSettings.disconnectBtn).click();

    // assert server is restarting
    cy.get(adminSettings.restartNotice).should("be.visible");
    // adding wait for server to restart
    cy.wait(120000);
    cy.waitUntil(() => cy.get(homePage.profileMenu).should("be.visible"));
    cy.get(homePage.profileMenu).click();
    cy.get(homePage.signOutIcon).click();
    cy.wait(500);
    // validating sso with github is disabled
    cy.get(adminSettings.loginWithGithub).should("not.exist");
  });
});
