@artifacts @regression @loginPage @unauthorized
Feature: Artifacts - Login Page

  @id303 @incognito
  Scenario: Verify MetaMask button when MM extension isn't installed
    Given Element with "class" "login-btn" should be "disabled"
    Then Element with "text" "Download MetaMask here" should be "visible"

  @id304 @id305 @nonAuthorized @flaky
  Scenario: Verify MetaMask button when MM extension is installed without authorized Account
    Given Log out from Portal
    And Element with "class" "login-btn" should be "enabled"
    Then Element with "text" "Download MetaMask here" should be "invisible"

  @id309 @cancelLogin
  Scenario: Verify MetaMask button is enabled when MM extension is installed with canceled Account
    Given Connect Metamask and press cancel button
    Then Element with "text" "Unable to connect to MetaMask wallet." should be "visible"
