@navigation @regression @mainPage @authorized

Feature: Internal Navigation - Main Page

  Background:
    Given Connect Metamask extension with login action

  @id319:I
  Scenario Outline: Check navigation for "<Item>" menu and <Route> link in Balances on Main Page
    Given I click by text "<Item>"
    Then Current page have "<Route>" address

    Examples:
      | Item              | Route     |
      | Transfer          | /transfer |
      | Receive           | /receive  |
      | Manage Token List | /tokens   |

  @id315:I
  Scenario Outline: Check navigations for "<Item>" menu and <Route>
    Given I click by text "<Item>"
    Then Current page have "<Route>" address

    Examples:
      | Item      | Route   |
      | Bridge    | /bridge |
      | Faucet    | /faucet |

