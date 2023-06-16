@withdraw @regression @transactions @bridgePage
Feature: Withdraw

  Background:
    Given Connect Metamask extension with login action
#    When I reset a nonce
#    Then I go to page ""

  Scenario: Make a withdraw in ETH
    Given I click by "text" with "zkSync Era∎" value
    Given I click by "href" with "/transaction/zksync/era" value
    Given I click by "text" with "Withdraw to Ethereum (L1)" value
    Given I click by "text" with "Your account" value
    When I choose "ETH" as token and insert "0.0000000001" as amount
    When I "confirm" transaction after clicking "Send to Ethereum Goerli" button



