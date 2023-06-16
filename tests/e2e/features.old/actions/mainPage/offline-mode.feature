@actions @regression @mainPage @offlineMode @authorized
Feature: Actions - Main Page - Offline Mode

  Background:
    Given Connect Metamask extension with login action

  @id452 @id453
  Scenario Outline: Verify the Offline mode view for "<Route>"
    Given I go to page "<Route>"
    Given Set "true" for offline mode
    When Element with "class" "offline-popup-title" should be "visible"
    When Element with "partial text" "Looking for a connection..." should be "visible"
    When Element with "class" "offline-spinner" should be "visible"
    And Set "false" for offline mode

    Examples:
      | Route            |
      | /                |
      | /transfer        |
      | /receive         |
      | /tokens          |
      | /tokens/add      |
      | /bridge          |
      | /bridge/withdraw |
      | /faucet          |
