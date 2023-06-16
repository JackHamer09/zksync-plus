@redirections @regression @loginPage @unauthorized

Feature: External Redirection

  @id99:I   @id306:I @nonAuthorized
  Scenario Outline: Check "<Extra button name>" link redirection with authorized MM extension
    Given Log out from Portal
    When I click by text "<Extra button name>"
    Then New page have "<url>" address

    Examples:
      | Extra button name | url                            |
      | Docs              | https://era.zksync.io/docs/dev/ |
      | Ecosystem         | https://ecosystem.zksync.io/   |
      | Explorer          | https://goerli.explorer.zksync.io/    |

  @id99:II @id306:II @nonAuthorized @flaky
  Scenario Outline:  Check "<Icon>" icon redirection with authorized MM extension
    Given Log out from Portal
    When I click by "alt" with "<Icon>" value
    Then New page have "<url>" address

    Examples:
      | Icon      | url                                |
      | Twitter   | https://twitter.com/zksync         |
      | Discord   | https://join.zksync.dev/           |

  @id307:I @incognito
  Scenario Outline: Check "<Extra button name>" link redirection with incognito mode
    Given I click by text "<Extra button name>"
    Then New page have "<url>" address

    Examples:
      | Extra button name | url                            |
      | Docs              | https://era.zksync.io/docs/dev/ |
      | Ecosystem         | https://ecosystem.zksync.io/   |
      | Explorer            | https://goerli.explorer.zksync.io/    |


  @id307:II @incognito
  Scenario Outline: Check "<Icon>" icon redirection with incognito mode
    Given I click by "alt" with "<Icon>" value
    Then New page have "<url>" address

    Examples:
      | Icon      | url                                |
      | Twitter   | https://twitter.com/zksync         |
      | Discord   | https://join.zksync.dev/           |
