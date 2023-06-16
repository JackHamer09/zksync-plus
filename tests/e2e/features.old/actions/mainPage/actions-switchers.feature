@actions @regression @mainPage @switchers @authorized
Feature: Actions - Main Page - Switchers

  Background:
    Given Connect Metamask extension with login action

  @id193:II
  Scenario: Select the Mainnet network on the switcher
    Given Set the "zkSync Era Mainnet" value for "network" switcher
    Then Check the "zkSync Era Mainnet" value is actual for "network" switcher
    And Set the "zkSync Era Testnet" value for "network" switcher
    And Check the "zkSync Era Testnet" value is actual for "network" switcher

  @id90:II
  Scenario: Select the Ukranian language switcher by default is English
    Given Set the "Ukrainian" value for "language" switcher
    Then Check the "Українська" value is actual for "language" switcher
    And Set the "Англійська" value for "language" switcher

