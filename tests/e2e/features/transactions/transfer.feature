#@transfer @regression @transactions @walletPage
#Feature: Transfer
#
#  Background:
#    Given Connect Metamask extension with login action
#    When I reset a nonce
#    Then I go to page ""
#
##  Tests work properly on local machine, but they should stabilized on CI
#  @id62 @id61 @id310
#  Scenario: Make a transfer in ETH
#    Given I select "Wallet" and go to "Transfer" subsection
#    When I insert "0x26A4c5Dfe2cA3c9E7E8C417B689F41b6b5745C37" as wallet address
#    When I choose "ETH" as token and insert "0.0000000001" as amount
#    When I "confirm" transaction after clicking "Transfer" button
#    Then Message "Transaction submitted" should be visible
#    Then Element with "text" "Use the transaction link to track the progress." should be "visible"
#    Then Element with "text" "Back to Balances" should be "visible"
#    Then Element with "text" "or make another transaction" should be "visible"
#    And Show the transaction number after success
#    #second part  - id61
#    Given Press the transaction link
#    Then Element with "partial text" "Transaction" should be "visible"
#    #third part  - id310
#    Then I check input field with value "zkSync Era Testnet" available in Metamask network settings
#    Then I check input field with value "https://testnet.era.zksync.dev" available in Metamask network settings
#    Then I check input field with value "280" available in Metamask network settings
#    Then I check input field with value "ETH" available in Metamask network settings
#    Then I check input field with value "https://goerli.explorer.zksync.io" available in Metamask network settings
#    Given I reset a nonce
#
#  Scenario: Transfer with insufficient funds
#    Given I select "Wallet" and go to "Transfer" subsection
#    When I insert "0x26A4c5Dfe2cA3c9E7E8C417B689F41b6b5745C37" as wallet address
#    When I choose "ETH" as token and insert "100000" as amount
#    When I click "Transfer" transaction button
#    Then Transaction button "Transfer" should be "disabled"
#
#  @id60
#  Scenario: Make a transfer reject
#    Given I select "Wallet" and go to "Transfer" subsection
#    When I insert "0x26A4c5Dfe2cA3c9E7E8C417B689F41b6b5745C37" as wallet address
#    When I choose "ETH" as token and insert "0.0000000001" as amount
#    When I click "Transfer" transaction button
#    When I "reject" transaction after clicking "Transfer" button
#    Then Message "Transaction rejected" should be visible
#    Then Message "An error occurred" should be visible
#
#  @id71
#  Scenario Outline: Check notification after transfer with an incorrect address "<Incorrect address>"
#    Given I select "Wallet" and go to "Transfer" subsection
#    When I insert "<Incorrect address>" as wallet address
#    When I choose "ETH" as token
#    When I insert "0.0000000001" as amount
#    And I click "Transfer" transaction button
#    Then Element with "partial class" "has-error" should be "visible"
#
#    Examples:
#      | Incorrect address                          |
#      | 0x8f0f44583aQ6908f7f933cd6f0aae382ac3fd8f6 |
#      | 0x8f0f44583a6908f7f933cd6f0aae382ac3fd8f6  |
#      | 0x8f0f44583a6908f7f933cd6f0aae382ac3fd8f6  |
#      | 0x8f0f44583a$6908f7f933cd6f0aae382ac3fd8f6 |
#
#
#  @id63
#  Scenario: Make a transfer in ETH and press Back button
#    Given I select "Wallet" and go to "Transfer" subsection
#    When I insert "0x26A4c5Dfe2cA3c9E7E8C417B689F41b6b5745C37" as wallet address
#    When I choose "ETH" as token and insert "0.0000000001" as amount
#    When I "confirm" transaction after clicking "Transfer" button
#    Then Message "Transaction submitted" should be visible
#    And Show the transaction number after success
#    And I click by "type" with "submit" value
#    Then Element with "testId" "balance-token-table" should be "visible"
#    Given I reset a nonce
#
#    @id65
#    Scenario: Check default fee for transaction
#      Given I select "Wallet" and go to "Transfer" subsection
#      And Fee should have "unknown" value
#      When I insert "0x26A4c5Dfe2cA3c9E7E8C417B689F41b6b5745C37" as wallet address
#      And I choose "ETH" as token and insert "0.0000000001" as amount
#      When I "confirm" transaction after clicking "Transfer" button
#      Then Message "Transaction submitted" should be visible
#      And Show the transaction number after success
#      Given I reset a nonce
