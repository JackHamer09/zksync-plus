@actions @regression @tokensPage @tokens @authorized
Feature: Actions - Tokens Page

  Background:
    Given Connect Metamask extension with login action

  @id327:I
  Scenario: Check error message appears if all fields aren't filled on Tokens Page
    Given I go to page "/tokens/add"
    And I click by "type" with "submit" value
    Then Element with "text" "Value is required" should be "visible"

  @id327:II
  Scenario: Check error message appears if two fields aren't filled on Tokens Page
    Given I go to page "/tokens/add"
    When I fill the text field for "id='Address'" selector by "0x058d6Fb2828608C0422BB6C89F77CCaA9ea7A9b4" value
    And I click by "type" with "submit" value
    Then Element with "text" "Value is required" should be "visible"

  @id327:III
  Scenario: Check error message appears if one required field isn't filled on Tokens Page
    Given I go to page "/tokens/add"
    When I fill the text field for "id='Address'" selector by "0x058d6Fb2828608C0422BB6C89F77CCaA9ea7A9b4" value
    When I fill the text field for "id='Decimals'" selector by "18" value
    And I click by "type" with "submit" value
    Then Element with "text" "Value is required" should be "visible"

  #  @id326
  #  Scenario: Verify custom token appears after the addition (SHIB)
  #    Given I go to page "/tokens/add"
  #    When I fill the text field for "id='Address'" selector by "0x058d6Fb2828608C0422BB6C89F77CCaA9ea7A9b4" value
  #    When I fill the text field for "placeholder='e.g. BTC'" selector by "SHIB" value
  #    When I fill the text field for "id='Decimals'" selector by "18" value
  #    And I click by "type" with "submit" value
  #    Then Element with "text" "SHIB" should be "visible"
  #    Then Element with "text" "Custom token" should be "visible"

  @id693
  Scenario: Check edit custom token functionality
    Given I go to page "/tokens/add"
    When I fill the text field for "id='Address'" selector by "0x058d6Fb2828608C0422BB6C89F77CCaA9ea7A9b4" value
    When I fill the text field for "id='Decimals'" selector by "18" value
    When I fill the text field for "id='Token ticker'" selector by "SHIB" value
    And I click by "type" with "submit" value
    Then Element with "text" "SHIB" should be "visible"
    Then Element with "text" "Custom token" should be "visible"
    Then Element with "testId" "token-label-edit-button" should be "visible"
    Then Element with "testId" "token-label-edit-button" should be "clickable"
    When I click by "testId" with "token-label-edit-button" value
    When I fill the text field for "id='Address'" selector by "0x3f152B63Ec5CA5831061B2DccFb29a874C317502" value
    When I fill the text field for "id='Decimals'" selector by "19" value
    When I fill the text field for "id='Token ticker'" selector by "SHIB2" value
    And I click by "type" with "submit" value
    Then Element with "text" "SHIB2" should be "visible"
    Then I click by "testId" with "token-label-edit-button" value
    Then I check input field with selector "id='Address'" to have text "0x3f152B63Ec5CA5831061B2DccFb29a874C317502" value
    Then I check input field with selector "id='Decimals'" to have text "19" value
    Then I check input field with selector "id='Token ticker'" to have text "SHIB2" value

  @id694
  Scenario: Check remove custom token functionality
    Given I go to page "/tokens/add"
    When Set the "zkSync Era Mainnet" value for "network" switcher
    When I fill the text field for "id='Address'" selector by "0x058d6Fb2828608C0422BB6C89F77CCaA9ea7A9b4" value
    When I fill the text field for "id='Decimals'" selector by "18" value
    When I fill the text field for "id='Token ticker'" selector by "SHIB" value
    And I click by "type" with "submit" value
    Then Element with "text" "SHIB" should be "visible"
    Then Element with "text" "Custom token" should be "visible"
    Then Element with "testId" "token-label-remove-button" should be "visible"
    Then Element with "testId" "token-label-remove-button" should be "clickable"
    Then I click by "testId" with "token-label-remove-button" value
    And Element with "text" "Remove Custom Token" should be "visible"
    And Element with "text" "Are you sure you want to remove custom token ‘SHIB’ with address ‘0x058...7A9b4’?" should be "visible"
    And Element with "text" "Cancel" should be "visible"
    And Element with "text" "Remove" should be "visible"
    Then I click by "text" with "Cancel" value
    Then Element with "text" "SHIB" should be "visible"
    Then Element with "text" "Custom token" should be "visible"
    Then I click by "testId" with "token-label-remove-button" value
    Then I click by "text" with "Remove" value
    Then Element with "text" "SHIB" should be "invisible"
    Then Element with "text" "Custom token" should be "invisible"
