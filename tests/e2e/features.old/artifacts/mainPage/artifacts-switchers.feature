@artifacts @regression @switchers
Feature: Artifacts - Main Page - Switchers

  Background:
    Given Connect Metamask extension with login action

  @id90:I
  Scenario: Check the language switcher by default is English
    Then Check the "English" value is actual for "language" switcher

  @id193:I
  Scenario: Check the network switcher by default is zkSync Era Testnet
    Then Check the "zkSync Era Testnet" value is actual for "network" switcher
