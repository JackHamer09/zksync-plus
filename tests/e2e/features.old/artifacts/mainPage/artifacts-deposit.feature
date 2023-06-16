@artifacts @regression @deposit @authorized
Feature: Artifacts - Main Page - Deposit

  Background:
    Given Connect Metamask extension with login action

  @id334
  Scenario: Verify Deposit artifacts
    Given My wallet is "filled"
    #default tokens list
    When I select "Bridge" and go to "Deposit" subsection
    Then Element with "testId" "amount-input-field" should be "visible"
    Then Element with "testId" "amount-balance" should be "visible"
    Then Element with "placeholder" "0.00" should be "visible"
    Then Element with "text" "MAX" should be "visible"
    Then Element with "text" "MAX" should be "clickable"
    Then Element with "testId" "token-dropdown" should be "visible"
    Then Element with "class" "swap-button" should be "visible"
    Then Element with "class" "swap-button" should be "clickable"
    Then Element with "testId" "amount-balance" should be "visible"
    Then Element with "testId" "balance-info-value" should be "visible"
    Then Element with "partial text" "~$" should be "visible"
    Then Fee should have "ETH" value
    Then Element with "text" "Deposit" should be "visible"
    Then Element with "text" "Deposit" should be "clickable"
    Then Element with "text" "up to 5 minutes" should be "visible"
    Then Element with "text" "Deposit to another address on zkSync Era Goerli " should be "visible"
    Given I click by "button" with "deposit-to-address-button-toggle" value
    Then Element with "text" "Deposit address on zkSync Era Goerli" should be "visible"
    Then Element with "text" "By default, we'll deposit your funds into your wallet. But if you want to deposit funds to another wallet in zkSync Era Goerli, use the form below" should be "visible"
