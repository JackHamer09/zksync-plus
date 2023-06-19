@withdraw @regression @transactions @bridgePage
Feature: Withdraw

  Background:
    Given Connect Metamask extension with login action

  Scenario: Make a withdraw in ETH
    Given I click by "text" with "zkSync Era∎" value
    Given I go to "Withdraw" transaction section
    Given I click by "text" with "Your account" value
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I "confirm" transaction after clicking "Send to Ethereum Goerli" button
    Then Message "Transaction submitted" should be visible


  Scenario: 1
    Given I go to "Withdraw" transaction section
    Given I click by "text" with "Your account" value
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I "confirm" transaction after clicking "Send to Ethereum Goerli" button
    Then Message "Transaction submitted" should be visible


  Scenario: 2
    Given I go to "Withdraw" transaction section
    Given I click by "text" with "Your account" value
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I "confirm" transaction after clicking "Send to Ethereum Goerli" button
    Then Message "Transaction submitted" should be visible

  Scenario: 3
    Given I go to "Withdraw" transaction section
    Given I click by "text" with "Your account" value
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I "confirm" transaction after clicking "Send to Ethereum Goerli" button
    Then Message "Transaction submitted" should be visible


  Scenario: 4
    Given I go to "Withdraw" transaction section
    Given I click by "text" with "Your account" value
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I "confirm" transaction after clicking "Send to Ethereum Goerli" button
    Then Message "Transaction submitted" should be visible

  Scenario: 5
    Given I go to "Withdraw" transaction section
    Given I click by "text" with "Your account" value
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I "confirm" transaction after clicking "Send to Ethereum Goerli" button
    Then Message "Transaction submitted" should be visible


  Scenario: 2
    Given I go to "Withdraw" transaction section
    Given I click by "text" with "Your account" value
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I "confirm" transaction after clicking "Send to Ethereum Goerli" button
    Then Message "Transaction submitted" should be visible
