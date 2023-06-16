@deposit @regression @transactions @bridgePage @noBlockChain
Feature: Deposit

  Background:
    Given Connect Metamask extension with login action

  Scenario: Before all reset a nonce in case of any changes
    Given I reset a nonce
    Then I go to page ""

  @id79
  Scenario: Deposit ETH, Fee ETH
    Given I select "Bridge" and go to "Deposit" subsection
    When I choose "ETH" as token and insert "0.0000000001" as amount
    And Get current fee amount
    And I choose "USDC" as token
    Then Fee should have "ETH" value
    Then Fee field should have "Approval" value

  Scenario: Deposit with insufficient funds
    Given I select "Bridge" and go to "Deposit" subsection
    When I choose "ETH" as token and insert "100000" as amount
    When I click "Deposit" transaction button
    Then Transaction button "Deposit" should be "disabled"

  @id50
  Scenario: Make a deposit reject
    Given I select "Bridge" and go to "Deposit" subsection
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I click "Deposit" transaction button
    When I "reject" transaction after clicking "Deposit" button
#    Then Message "Transaction rejected" should be visible
    Then Message "An error occurred" should be visible

  @id41
  Scenario: Verify Deposit form
    Given I select "Bridge" and go to "Deposit" subsection
    Then Element with "testId" "amount-balance" should be "visible"
    When I choose "ETH" as token and insert "0.0000000001" as amount
    Then Element with "testId" "token-dropdown" should be "visible"
    Then Element with "class" "converted-fee-value" should be "visible"
    Then Element with "class" "swap-button" should be "visible"
    Given I click by "class" with "swap-button" value
    Then Current page have "/bridge/withdraw" address
