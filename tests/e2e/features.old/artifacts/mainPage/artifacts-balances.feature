@artifacts @regression @mainPage @balances @authorized
Feature: Artifacts - Main Page - Balances

  Background:
    Given Connect Metamask extension with login action

  @id321
  Scenario: Verify Balances artifacts for filled wallet on Main Page
    Then My wallet is "filled"
    #default tokens list
    Then Element with "testId" "balance-token-table" should be "visible"
    Then Element with "text" "Manage Token List" should be "visible"
    Then Element with "text" "Manage Token List" should be "clickable"
    #tokens
    Then Element with "text" "ETH" should be "visible"
    Then Element with "text" "Ether" should be "visible"
    Then Element with "text" "USDC" should be "visible"
    Then Element with "partial text" "USD Coin" should be "visible"
    Then Element with "text" "wBTC" should be "visible"
    Then Element with "text" "DAI" should be "visible"
    Then Element with "text" "LINK" should be "visible"
    Then Element with "partial text" "ChainLink Token" should be "visible"
    #token smart contract address
    Then Element with "title" "0x0000000000000000000000000000000000000000" should be "visible"
    Then Element with "title" "0x0000000000000000000000000000000000000000" should be "clickable"
    Then Element with "title" "0x3e7676937a7e96cfb7616f255b9ad9ff47363d4b" should be "visible"
    Then Element with "title" "0x3e7676937a7e96cfb7616f255b9ad9ff47363d4b" should be "clickable"
    Then Element with "title" "0x40609141db628beee3bfab8034fc2d8278d0cc78" should be "visible"
    Then Element with "title" "0x40609141db628beee3bfab8034fc2d8278d0cc78" should be "clickable"
    Then Element with "title" "0x0faf6df7054946141266420b43783387a78d82a9" should be "visible"
    Then Element with "title" "0x0faf6df7054946141266420b43783387a78d82a9" should be "clickable"
    Then Element with "title" "0x0bfce1d53451b4a8175dd94e6e029f7d8a701e9c" should be "visible"
    Then Element with "title" "0x0bfce1d53451b4a8175dd94e6e029f7d8a701e9c" should be "clickable"

  @id72 @emptyWallet
  Scenario: Verify Balances artifacts for empty wallet on Main Page
    Then My wallet is "empty"
    #default tokens list
    Then Element with "testId" "balance-token-table" should be "invisible"
    Then Element with "text" "Manage Token List" should be "visible"
    Then Element with "text" "Manage Token List" should be "clickable"
    Then Element with "text" "Try our faucet to get free funds" should be "visible"
    Then Element with "text" "Your L2 Balance is empty" should be "visible"

  @id454 @emptyWallet
  Scenario: Verify Balances artifacts for empty wallet on Main Page
    Given My wallet is "empty"
    When Set the "zkSync Era Mainnet" value for "network" switcher
    Then Balance value should be "0.00"
    Then Element with "text" "You can bridge assets from Ethereum Mainnet" should be "visible"
    Then Element with "testId" "balance-token-table" should be "invisible"
    Then Element with "text" "Manage Token List" should be "visible"
    Then Element with "text" "Manage Token List" should be "clickable"
    Then Element with "text" "Your assets" should be "visible"
    Then Element with "text" "Your L2 Balance is empty" should be "visible"
    Then Element with "text" "Go to Bridge" should be "visible"
    Then Element with "text" "Go to Bridge" should be "clickable"
    Then Element with "text" "Go to Faucet" should be "invisible"

