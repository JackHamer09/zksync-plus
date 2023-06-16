@artifacts @withdraw @regression @bridgePage
Feature: Withdraw

  Background:
    Given Connect Metamask extension with login action

@id335
  Scenario: Check artifacts on Withdraw Page
    Given I select "Bridge" and go to "Withdraw" subsection
    Then Element with "testId" "amount-input-field" should be "visible"
    Then Element with "placeholder" "0.00" should be "visible"
    Then Balance label for current layer is shown
    Then Element with "testId" "amount-balance" should be "visible"
    Then Element with "text" "MAX" should be "visible"
    Then Element with "text" "MAX" should be "disabled"
    Then Element with "class" "swap-button" should be "visible"
    Then Element with "class" "swap-button" should be "clickable"
    Then Element with "testId" "balance-info-value" should be "visible"
    Then Element with "testId" "fee-field" should be "visible"
    Then Element with "text" "Send to other wallet " should be "visible"
    When I click by text "Send to other wallet"
    Then Element with "text" "Withdraw Address on Ethereum" should be "visible" 
    Then Element with "text" "By default, you'll withdraw funds into your Ethereum wallet, but you can change it in the form below" should be "visible" 
    Then Element with "testId" "address-block-input-field" should be "visible" 
    Then Transaction button "Withdraw" should be "visible"
    Then Transaction button "Withdraw" should be "clickable"
    Then Element with "text" "up to 1 hour" should be "visible"
    When I choose "ETH" as token and insert "0.0000000001" as amount
    Then Fee should have "ETH" value

@id55 
  Scenario: Verify withdraw form 
    Given I select "Bridge" and go to "Withdraw" subsection 
    Then Element with "testId" "amount-balance" should be "visible" 
    Then Element with "testId" "amount-input-field" should be "visible" 
    Then Element with "testId" "token-dropdown" should be "visible" 
    Then Element with "class" "swap-button" should be "clickable"
    Then I click Swap button 
    Then Current page have "/bridge" address
    Then Element with "testId" "amount-balance" should be "visible" 
    Then Element with "testId" "amount-input-field" should be "visible"
    Then Element with "class" "swap-button" should be "clickable"
    When I click Swap button 
    Then Current page have "/bridge/withdraw" address 
