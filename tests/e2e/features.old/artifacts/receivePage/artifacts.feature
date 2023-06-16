@artifacts @regression @authorized
Feature: Artifacts - Receive page

  Background:
    Given Connect Metamask extension with login action

  @id328
  Scenario: Check artifacts on Receive Page
    When I go to page "/receive"
    Then Element with "text" "My QR Code" should be "visible"
    Then QR code is visible
    Then Element with "text" "Wallet Address" should be "visible"
    Then Element with "text" "0x586607935e1462ab762f438e0a7b2968a4158975" should be "visible"
    Then Element with "text" "Copy Address " should be "visible"
    Then Element with "text" "Copy Address " should be "clickable"