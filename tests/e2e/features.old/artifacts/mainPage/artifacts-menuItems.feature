@artifacts @regression @mainPage @menu @authorized
Feature: Artifacts - Main Page - Menu Items

  Background:
    Given Connect Metamask extension with login action

  @id314:I
  Scenario: Verify Menu items on Main Page
    Then Element with "partial text" "Wallet" should be "visible"
    Then Element with "partial text" "Bridge" should be "visible"
    Then Element with "partial text" "Faucet" should be "visible"
    Then Element with "partial text" "Documentation" should be "visible"
    Then Element with "partial text" "Block Explorer" should be "visible"
    Then Element with "partial text" "zkSync Ecosystem" should be "visible"
    Then Element with "partial text" "0x58660793...158975" should be "visible"
    Then Element with "class" "copy-button" should be "clickable"


  @id314:II
  Scenario: Verify Menu items drop down SubMenu on Main Page
    Given I click on dropdown submenu
    Given Element with "partial text" "Support" should be "visible"
    Given Element with "partial text" "Logout" should be "visible"