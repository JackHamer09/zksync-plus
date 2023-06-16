@redirections @regression @mainPage @authorized

Feature: External Redirection

  Background:
    Given Connect Metamask extension with login action

  @id315:II
  Scenario Outline: Check "<Extra button name>" link with "<url>" value from Main Page
    When I click by text "<Extra button name>"
    Then New page have "<url>" address

    Examples:
      | Extra button name | url                                |
      | Documentation     | https://era.zksync.io/docs/dev/    |
      | zkSync Ecosystem  | https://ecosystem.zksync.io/       |
      | Block Explorer    | https://goerli.explorer.zksync.io/ |


  @id319:II
  Scenario Outline: Check navigation for "<Item>" token and "<url>" link in Balances on Main Page
    Given I click by "title" with "<Item>" value
    Then New page have "<url>" address
    Examples:
      | Item                                       | url                                                                           |
      | 0x0000000000000000000000000000000000000000 | https://goerli.explorer.zksync.io/address/0x0000000000000000000000000000000000000000 |
      | 0x3e7676937a7e96cfb7616f255b9ad9ff47363d4b | https://goerli.explorer.zksync.io/address/0x3e7676937a7e96cfb7616f255b9ad9ff47363d4b |
      | 0x40609141db628beee3bfab8034fc2d8278d0cc78 | https://goerli.explorer.zksync.io/address/0x40609141db628beee3bfab8034fc2d8278d0cc78 |
      | 0x0faf6df7054946141266420b43783387a78d82a9 | https://goerli.explorer.zksync.io/address/0x0faf6df7054946141266420b43783387a78d82a9 |
      | 0x0bfce1d53451b4a8175dd94e6e029f7d8a701e9c | https://goerli.explorer.zksync.io/address/0x0bfce1d53451b4a8175dd94e6e029f7d8a701e9c |
  
  @id666
  Scenario Outline: Check redirection to Block Explorer Mainnet
    Given Set the "zkSync Era Mainnet" value for "network" switcher
    When I click by "title" with "0x586607935e1462ab762f438e0a7b2968a4158975" value
    Then New page have "https://explorer.zksync.io/address/0x586607935e1462ab762f438e0a7b2968a4158975" address
    
