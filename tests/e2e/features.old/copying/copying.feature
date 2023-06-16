@copying @regression @mainPage @authorized

Feature: Copying - Menu - Buttons

  @id316
  Scenario: Check copying button
    Given Connect Metamask extension with login action
    When I click by "class" with "copy-button" value
    Then Element with "text" "Copied!" should be "visible"