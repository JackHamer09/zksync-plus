@artifacts @regression @faucet @authorized
Feature: Artifacts - Faucet

  Background:
    Given Connect Metamask extension with login action

  @id27:I
  Scenario: Check artifacts on the Faucet page
    Given I go to page "/faucet"
    Then Element with "text" "Faucet" should be "visible"
    Then Element with "partial text" "You can request a limited amount of tokens from our faucet for testing once per 24h. Just click on the button below." should be "visible"
    Then Element with "text" "Request Funds from Faucet" should be "visible"