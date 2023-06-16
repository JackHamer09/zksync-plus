@artifacts @regression @tokensPage @tokens @authorized
Feature: Artifacts - Tokens Page

  Background:
    Given Connect Metamask extension with login action

  @id322
  Scenario: Check artifacts on Tokens Page
    When I go to page "/tokens"
    Then Element with "class" "search-input" should be "visible"
        #tokens
    Then Element with "text" "ETH" should be "visible"
    Then Element with "text" "Ether" should be "visible"
    Then Element with "text" "USDC" should be "visible"
    Then Element with "partial text" "USD Coin" should be "visible"
    Then Element with "text" "wBTC" should be "visible"
    Then Element with "text" "DAI" should be "visible"
    Then Element with "text" "LINK" should be "visible"
    Then Element with "partial text" "ChainLink Token" should be "visible"
        # toggles
    Then Toggle for "ETH" token should be visible
    Then Toggle for "ETH" token should have "on" state
    Then Toggle for "USDC" token should be visible
    Then Toggle for "USDC" token should have "on" state
    Then Toggle for "wBTC" token should be visible
    Then Toggle for "wBTC" token should have "on" state
    Then Toggle for "DAI" token should be visible
    Then Toggle for "DAI" token should have "on" state
    Then Toggle for "LINK" token should be visible
    Then Toggle for "LINK" token should have "on" state
    # link for the custom adding token
    Then Element with "partial text" "enter token data manually" should be "visible"
    Then Element with "partial text" "enter token data manually" should be "clickable"

  @id324
  Scenario: Check artifacts for adding token feature on Tokens Page
    When I go to page "/tokens/add"
    Then Element with "id" "Address" should be "visible"
    Then Element with "text" "Token ticker" should be "visible"
    Then Element with "id" "Decimals" should be "visible"
    Then Element with "text" "Add token" should be "visible"
    Then Element with "text" "Add token" should be "clickable"
    Then Element with "text" "Cancel" should be "clickable"
    Then Element with "text" "Tip: Custom tokens are stored locally in your browser" should be "visible"
