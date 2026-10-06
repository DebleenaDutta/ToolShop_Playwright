# Toolshop Playwright Tests

Playwright end-to-end and API-assisted tests for the [Practice Software Testing Toolshop](https://practicesoftwaretesting.com/).

## Requirements

- Node.js
- npm

## Setup

Install project dependencies and the Playwright browsers:

```bash
npm ci
npx playwright install
```

## Run tests

Run all tests in Chromium, Firefox, and WebKit:

```bash
npx playwright test
```

Run one spec or browser project:

```bash
npx playwright test tests/Authentication.spec.ts
npx playwright test tests/Cart.spec.ts --project=chromium
```

Open the HTML report after a run:

```bash
npx playwright show-report
```

The storefront base URL, API base URL, browser projects, and demo login account are configured in `playwright.config.ts`.

## Test cases

### Authentication — `tests/Authentication.spec.ts`

- **Successful login and logout:** verifies the login API returns `200`, the account page and signed-in username are shown, and signing out returns the sign-in link.
- **Invalid credentials:** verifies the login API returns `401` and the invalid-credentials message is displayed.

### Cart — `tests/Cart.spec.ts`

- **Add a searched product:** searches for the configured Hammer product, verifies the cart API receives the expected product ID and quantity, checks the API response is `200`, and checks the confirmation alert.
- **Remove a product:** creates an isolated cart through the API, adds two products, verifies both are present, deletes one, and verifies the remaining cart item and quantity.

### Registration — `tests/Register.spec.ts`

- **Submit registration details:** intercepts the registration endpoint with a mocked `201` response, verifies the submitted registration fields, and checks the postcode lookup request parameters. The postcode lookup itself uses the live API.
- **Required-field validation:** submits the empty registration form, checks the inline required-field messages, and verifies that no registration request is sent.

## Test data and page objects

- Shared test data is in `test-data/testData.ts`.
- Page objects and grouped locator enums are in `pages/`.

