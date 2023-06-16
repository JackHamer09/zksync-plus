@withdraw @regression @transactions @bridgePage
Feature: Withdraw

  Background:
    Given Connect Metamask extension with login action
    When I reset a nonce
    Then I go to page ""

  @id51 @id56
  Scenario: Make a withdraw in ETH
    #first part - id51
    Given I select "Bridge" and go to "Withdraw" subsection
    When I choose "ETH" as token and insert "0.0000000001" as amount
    Then Fee should have "ETH" value
    And I "confirm" transaction after clicking "Withdraw" button
    Then Message "Transaction submitted" should be visible
    Then Element with "text" "Use the transaction link to track the progress." should be "visible"
    Then Element with "text" "Back to Balances" should be "visible"
    Then Element with "text" "or make another transaction" should be "visible"
    And Show the transaction number after success
    #second part  - id56
    Given Press the transaction link
    Then Element with "partial text" "Transaction" should be "visible"
    Given I reset a nonce

  @id84
  Scenario: Make a Withdraw with sending to other wallet
    Given I select "Bridge" and go to "Withdraw" subsection
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I click by text "Send to other wallet"
    When I insert "0x26A4c5Dfe2cA3c9E7E8C417B689F41b6b5745C37" as withdraw address
    When I "confirm" transaction after clicking "Withdraw" button
    Then Message "Transaction submitted" should be visible
    Given I reset a nonce

  @id53
  Scenario: Make a withdraw and back to home page
    Given I select "Bridge" and go to "Withdraw" subsection
    When I choose "ETH" as token and insert "0.0000000001" as amount
    Then Fee should have "ETH" value
    And I "confirm" transaction after clicking "Withdraw" button
    Then Message "Transaction submitted" should be visible
    And Show the transaction number after success
    And I click by "type" with "submit" value
    Then Element with "testId" "balance-token-table" should be "visible"
    Given I reset a nonce

  Scenario: Withdraw ETH, Fee ETH
    Given I select "Bridge" and go to "Withdraw" subsection
    When I choose "ETH" as token and insert "0.0000000001" as amount
    Given Fee should have "ETH" value

  Scenario: Withdraw with insufficient funds
    Given I select "Bridge" and go to "Withdraw" subsection
    When I choose "ETH" as token and insert "100000" as amount
    When I click "Withdraw" transaction button
    Given Transaction button "Withdraw" should be "disabled"

  @id54
  Scenario: Make a withdraw reject
    Given I select "Bridge" and go to "Withdraw" subsection
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I click "Withdraw" transaction button
    When I "reject" transaction after clicking "Withdraw" button
    Then Message "Transaction rejected" should be visible
    Then Message "An error occurred" should be visible

  @id84
  Scenario: Make a Withdraw with sending to other wallet
    Given I select "Bridge" and go to "Withdraw" subsection
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I click by text "Send to other wallet"
    When I insert "0x26A4c5Dfe2cA3c9E7E8C417B689F41b6b5745C37" as withdraw address
    When I click "Withdraw" transaction button
    When I "confirm" transaction after clicking "Withdraw" button
    Then Message "Transaction submitted" should be visible

  @id206
  Scenario: Withdraw with max button
    Given I select "Bridge" and go to "Withdraw" subsection
    When I choose "ETH" as token
    Then Element with "text" "MAX" should be "visible"
    Then Element with "text" "MAX" should be "enabled"
    When I click by text "MAX"
    Then Element with "text" "MAX" should be "disabled"
    Then Max amount is set
