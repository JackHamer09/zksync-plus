@artifacts @regression @mainPage @menu
Feature: Artifacts - Main Page

  Background:
    Given Connect Metamask extension with login action

  @id691
  Scenario: Verify ZkSync Era logo and network names
    #zkSync Era Mainnet network
    Given Set the "zkSync Era Mainnet" value for "network" switcher
    When Check the "zkSync Era Mainnet" value is actual for "network" switcher
    Then Element with "testId" "menu-logo" should be "visible"
    When I select "Bridge" and go to "Withdraw" subsection
    Then Check the "zkSync Era Mainnet" label is actual for "from" destination layer
    Then Check the "Ethereum Mainnet" label is actual for "to" destination layer
    When I select "Bridge" and go to "Deposit" subsection
    Then Check the "Ethereum Mainnet" label is actual for "from" destination layer
    Then Check the "zkSync Era Mainnet" label is actual for "to" destination layer
    When I select "Wallet" and go to "Transfer" subsection
    Then Check the "zkSync Era Mainnet" label is actual for "from" destination layer
    #zkSync Era Testnet network
    Given Set the "zkSync Era Testnet" value for "network" switcher
    When Check the "zkSync Era Testnet" value is actual for "network" switcher
    Then Element with "testId" "menu-logo" should be "visible"
    When I select "Bridge" and go to "Withdraw" subsection
    Then Check the "zkSync Era Testnet" label is actual for "from" destination layer
    Then Check the "Ethereum Goerli" label is actual for "to" destination layer
    When I select "Bridge" and go to "Deposit" subsection
    Then Check the "Ethereum Goerli" label is actual for "from" destination layer
    Then Check the "zkSync Era Testnet" label is actual for "to" destination layer
    When I select "Wallet" and go to "Transfer" subsection
    Then Check the "zkSync Era Testnet" label is actual for "from" destination layer
    When Log out from Portal
    Then Element with "testId" "sign-in-logo" should be "visible"


  @id691:I @featureEnv
  Scenario: Verify ZkSync Era logo and network names 
    #Goerli (Stage2) network
    Given Set the "Goerli (Stage2)" value for "network" switcher
    When Check the "Goerli (Stage2)" value is actual for "network" switcher
    Then Element with "testId" "menu-logo" should be "visible"
    When I select "Bridge" and go to "Withdraw" subsection
    Then Check the "Goerli (Stage2)" label is actual for "from" destination layer
    Then Check the "Ethereum Goerli" label is actual for "to" destination layer
    When I select "Bridge" and go to "Deposit" subsection
    Then Check the "Ethereum Goerli" label is actual for "from" destination layer
    Then Check the "Goerli (Stage2)" label is actual for "to" destination layer
    When I select "Wallet" and go to "Transfer" subsection
    Then Check the "Goerli (Stage2)" label is actual for "from" destination layer   

  @id698
  Scenario: Check metadata content on the page
    Then Check metadata element "<Metadata>" contains "<Content>"

    Examples:
      | Metadata       | Content                                                                                                                                                              |
      | og:title       | zkSync Era Portal \| Wallet, Bridge and Faucet                                                                                                                       |
      | og:description | zkSync Era Portal provides all the required tools for working with Era network such as Wallet, Bridge & Faucet functionality. To help you develop & test your dApps. |
      | og:image:alt   | zkSync Era Portal \| Wallet, Bridge and Faucet                                                                                                                       |
