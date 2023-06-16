#@deposit @regression @transactions @bridgePage @blockChain
#Feature: Deposit
#
#  Background:
#    Given Connect Metamask extension with login action
#    When I reset a nonce
#    Then I go to page ""
#
#  @id48
#  Scenario: Make a deposit in ETH and press back
#    Given I select "Bridge" and go to "Deposit" subsection
#    When I choose "ETH" as token and insert "0.0000000001" as amount
#    When I "confirm" transaction after clicking "Deposit" button
#    Then Message "Transaction submitted" should be visible
#    And Show the transaction number after success
#    And I click by "type" with "submit" value
#    Then Element with "testId" "balance-token-table" should be "visible"
#    And I reset a nonce
#
#  @id42 @id49
#  Scenario: Make a deposit in ETH
#    Given I select "Bridge" and go to "Deposit" subsection
#    When I choose "ETH" as token and insert "0.0000000001" as amount
#    When I "confirm" transaction after clicking "Deposit" button
#    Then Message "Transaction submitted" should be visible
#    Then Element with "text" "Use the transaction link to track the progress." should be "visible"
#    Then Element with "text" "Back to Balances" should be "visible"
#    Then Element with "text" "or make another transaction" should be "visible"
#    And Show the transaction number after success
#    Then Element with "partial href" "https://goerli.etherscan.io" should be "visible"
#    Then Element with "partial href" "https://goerli.etherscan.io" should be "clickable"
#    #second part  - id49
#    And Press the transaction link
#    And New page includes "https://goerli.etherscan.io" address
#    And I reset a nonce
#
#  @id684 @id685
#  Scenario: Make a Deposit with sending to other wallet
#    Given I select "Bridge" and go to "Deposit" subsection
#    When I choose "ETH" as token and insert "0.0000000001" as amount
#    When I click by text "Deposit to another address on zkSync "
#    When I insert "0x26A4c5Dfe2cA3c9E7E8C417B689F41b6b5745C37" as deposit address
#    When I "confirm" transaction after clicking "Deposit" button
#    Then Message "Transaction submitted" should be visible
#    And Show the transaction number after success
#    Then Element with "partial href" "https://goerli.etherscan.io" should be "visible"
#    Then Element with "partial href" "https://goerli.etherscan.io" should be "clickable"
#    And Press the transaction link
#    And New page includes "https://goerli.etherscan.io" address
#    And I reset a nonce