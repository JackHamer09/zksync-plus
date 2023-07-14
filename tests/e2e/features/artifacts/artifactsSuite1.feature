@artifactsSuite1 @artifacts @regression
Feature: Artifacts - UI

  Background:
    Given Connect Metamask extension with login action


  @id1438 @deposit
  Scenario: Check artifacts on the Approve allowance modal - Deposits
    Given I am on the Main page
    Given I go to page "/transaction/zksync/era/deposit/?network=era-goerli"
    When I click by "testId" with "your-account" value
    When I confirm the network switching
    When I choose "DAI" as token and insert "6" as amount
    Then Element with "text" " Continue " should be "clickable"
    When I click by text " Continue "
    Then Element with "text" "Allowance" should be "visible"
    Then Element with "text" "Your Ethereum Goerli account" should be "visible"
    Then Element with "partial class" "address-card-avatar" should be "visible"
    Then Modal card element with the "//*[text()='0xa439...046']" xpath should be "visible"
    Then Modal card element with the "//*[@alt='DAI token icon']" xpath should be "visible"
    Then Modal card element with the "//*[text()='0x3e7676...D4b']" xpath should be "visible"
    Then Modal card element with the "//*[@class='token-balance-price']" xpath should be "visible"
    Then Modal card element with the "//*[text()='Approving allowance for deposit']" xpath should be "visible"
    Then Modal card element with the "//*[@src='/img/era.svg']" xpath should be "visible"
    Then Element with "partial text" " Allowance lets you safely authorize the deposit process to access a specific amount of your tokens. No funds will be deducted after signing, except for " should be "visible"
    Then Element with "partial text" "Learn more" should be "visible"
    Then Element with "partial text" "Learn more" should be "clickable"
    Then Element with "partial text" "Approve allowance" should be "visible"
    Then Element with "partial text" "Approve allowance" should be "clickable"

  @id1534 @header
  Scenario: Check artifacts on the Header
    Given I am on the Main page
    Then Element with "href" "/" should be "visible"
    Then Element with "href" "/" should be "clickable"
    Then Element with "aria-label" "Medium Blog" should be "visible"
    Then Element with "aria-label" "Medium Blog" should be "clickable"
    Then Element with "aria-label" "Discord Community" should be "visible"
    Then Element with "aria-label" "Discord Community" should be "clickable"
    Then Element with "aria-label" "Telegram Support" should be "visible"
    Then Element with "aria-label" "Telegram Support" should be "clickable"
    Then Element with "aria-label" "Twitter Community" should be "visible"
    Then Element with "aria-label" "Twitter Community" should be "clickable"
    Then Element with "aria-label" "Email" should be "visible"
    Then Element with "aria-label" "Email" should be "clickable"

  @id1428 @header
  Scenario: Check artifacts on the Receive page
    Given I am on the Main page
    When I go to page "/transaction/zksync/era/receive"
    Then Element with "text" "Receive" should be "visible"
    Then Element with "text" "Official bridge" should be "visible"
    Then Element with "text" "Add funds using official bridge" should be "visible"
    Then Element with "href" "/transaction/zksync/era/deposit" should be "visible"
    Then Element with "href" "/transaction/zksync/era/deposit" should be "clickable"
    Then Element with "text" "View address" should be "visible"
    Then Element with "text" "Receive from another account" should be "visible"
    Then Element with "href" "/transaction/zksync/era/receive-address" should be "visible"
    Then Element with "href" "/transaction/zksync/era/receive-address" should be "clickable"
    Then Element with "text" "Receive test tokens" should be "visible"
    Then Element with "text" "Use official faucet to get test tokens" should be "visible"
    Then Element with "href" "/transaction/zksync/era/faucet" should be "visible"
    Then Element with "href" "/transaction/zksync/era/faucet" should be "clickable"
    Then Element with "text" "Top-up with cash" should be "visible"
    Then Element with "text" "Ramp" should be "visible"
    Then Element with "href" "https://ramp.network/buy/" should be "visible"
    Then Element with "href" "https://ramp.network/buy/" should be "clickable"
    Then Element with "text" "Top-up from another network" should be "visible"
    Then Element with "text" "Layerswap" should be "visible"
    Then Element with "href" "https://www.layerswap.io/?destNetwork=ZKSYNCERA_MAINNET" should be "visible"
    Then Element with "text" "Orbiter" should be "visible"
    Then Element with "href" "https://www.orbiter.finance/?dest=zkSync%20Era" should be "clickable"

  @id1352 @header
  Scenario: Check artifacts on the Receive Address (QR) page
    Given I am on the Main page
    When I go to page "/transaction/zksync/era/receive-address"
    Then Element with "text" "Receive" should be "visible"
    Then Element with "class" "qr-code-container" should be "visible"
    Then Element with "text" "0xa439ba...046" should be "visible"
    Then Element with "text" "Scan to copy address" should be "visible"
    Then Element with "text" "Copy" should be "visible"
    Then Element with "text" "Copy" should be "clickable"
    Then Element with "text" " Please transfer funds to this address using " should be "visible"
    Then Element with "text" "zkSync Era∎ Goerli" should be "visible"
    Then Element with "text" " to successfully receive them " should be "visible"

  @id1332 @emptyWallet
  Scenario: Check artifacts for an empty wallet
    Then A wallet should be "empty"
    Then Message " You don't have any balances on " should be visible
    Then Message "zkSync Era∎ Goerli" should be visible
    Then Message " Proceed to " should be visible
    Then Message "Add funds" should be visible
    Then Message " page to add balance to your account " should be visible
    Then Element with "href and text" "'/transaction/zksync/era/receive' and 'Add funds'" should be "visible"
    Then Element with "href and text" "'/transaction/zksync/era/receive' and 'Add funds'" should be "clickable"
    Then Element with "href and text" "'/balances' and 'View all'" should be "visible"
    Then Element with "href and text" "'/balances' and 'View all'" should be "clickable"


