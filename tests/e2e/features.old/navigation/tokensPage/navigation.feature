@navigation @regression @tokensPage @authorized

Feature: Internal Navigation - Tokens Page

  Background:
    Given Connect Metamask extension with login action

  @id323
  Scenario: Check navigation for "Enter token data manually" element
    Given I go to page "/tokens"
    When I click by text "enter token data manually"
    Then Current page have "/tokens/add" address

  @id325:II
  Scenario: Check navigation after the interruption of the custom token addition (SHIB)
    Given I go to page "/tokens/add"
    When I fill the text field for "id='Address'" selector by "0x058d6Fb2828608C0422BB6C89F77CCaA9ea7A9b4" value
    When I fill the text field for "placeholder='e.g. BTC'" selector by "SHIB" value
    When I fill the text field for "id='Decimals'" selector by "18" value
    And I click by "text" with "Cancel" value
    Then Current page have "/tokens" address

  @id325:I
  Scenario: Check navigation after the custom token addition (SHIB)
    Given I go to page "/tokens/add"
    When I fill the text field for "id='Address'" selector by "0x058d6Fb2828608C0422BB6C89F77CCaA9ea7A9b4" value
    When I fill the text field for "placeholder='e.g. BTC'" selector by "SHIB" value
    When I fill the text field for "id='Decimals'" selector by "18" value
    And I click by "type" with "submit" value
    Then Current page have "/tokens" address
