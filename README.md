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

## GitHub Actions

The Playwright workflow checks out the Toolshop application from
[`testsmith-io/practice-software-testing`](https://github.com/testsmith-io/practice-software-testing),
starts its Docker Compose services, and seeds the Sprint 5 database before
running tests against the local UI (`http://localhost:4200`) and API
(`http://localhost:8091`). The application revision is pinned in the workflow
so CI runs against a stable version.

For local runs, the hosted storefront and API remain the defaults. Override
them with `TOOLSHOP_BASE_URL` and `TOOLSHOP_API_BASE_URL` when running against
a local Toolshop instance.

## Test cases

### TC001 - Authentication — `tests/Authentication.spec.ts`

- **Successful login and logout:** verifies the login API returns `200`, the account page and signed-in username are shown, and signing out returns the sign-in link.

Steps:
1. Navigate to the storefront.
2. Click Sign in.
3. Enter the demo account email and password.
4. Click Login.
5. Open the username menu.
6. Click Sign out.

Expected:
1. Home page loads with a Sign in link.
2. Login form appears.
3. Email and password fields accept input.
4. My account page appears, and navigation shows the signed-in username.
5. The menu shows the Sign out option.
6. User is logged out, and navigation shows Sign in.

- **Invalid credentials:** verifies the login API returns `401` and the invalid-credentials message is displayed.

Steps:
1. Navigate to the storefront.
2. Click Sign in.
3. Enter an invalid email and password.
4. Click Login.

Expected:
1. Home page loads.
2. Login form appears.
3. Credentials can be entered.
4. “Invalid email or password” appears, and the login form remains visible.

### TC002 - Cart — `tests/Cart.spec.ts`

- **Add a searched product:** searches for the configured Hammer product, verifies the cart API receives the expected product ID and quantity, checks the API response is `200`, and checks the confirmation alert.

Pre-requisites: Have an empty cart.

Steps:
1. Navigate to the storefront.
2. Enter Hammer in the search field.
3. Click Search.
4. Click the product named exactly Hammer.
5. Set or confirm the quantity as 1.
6. Click Add to cart.
7. Open the cart.

Expected:
1. Home page loads with the product catalog and search field.
2. Search text can be entered.
3. Matching products appear, including Hammer.
4. Hammer’s product details page opens.
5. Quantity shows 1.
6. “Product added to shopping cart” appears.
7. Cart contains Hammer with quantity 1.

- **Remove a product:** creates an isolated cart through the API, adds two products, verifies both are present, deletes one, and verifies the remaining cart item and quantity.

Pre-requisites: Cart has Hammer and Claw Hammer, each with quantity 1.

Steps:
1. Open the cart.
2. Locate the Hammer row.
3. Click its remove/delete control.
4. Check the remaining cart contents.
5. Refresh the page.

Expected:
1. Cart displays Hammer and Claw Hammer, each with quantity 1.
2. Hammer has a remove/delete control.
3. Hammer is removed from the cart.
4. Only Claw Hammer remains, with quantity 1.
5. Cart still contains only Claw Hammer with quantity 1.

Note: The automated counterpart verifies removal through API calls. These steps verify the same outcome through the UI.

### TC003 - Registration — `tests/Register.spec.ts`

- **Submit registration details:** intercepts the registration endpoint with a mocked `201` response, verifies the submitted registration fields, and checks the postcode lookup request parameters. The postcode lookup itself uses the live API.

Pre-requisites: Use a unique test email when creating a real account.

Steps:
1. Navigate to the storefront.
2. Click Sign in.
3. Click the registration link.
4. Enter first name, last name, and date of birth.
5. Select Country from drop-down; enter postcode and house number.
6. Wait for address lookup and check the street and city fields.
7. Enter state, phone, a unique test email, and password.
8. Click Register.

Expected:
1. Home page loads.
2. Login form appears.
3. Registration form appears.
4. Name and date-of-birth fields accept the values.
5. Country and address inputs accept the values; address lookup is triggered.
6. Address lookup populates the required address fields. Record any lookup error or missing values.
7. Remaining fields accept the values.
8. Valid registration is accepted, with a success indication or navigation to the sign-in page.

Note: Automation mocks the registration success response and checks submitted data. Manual submission uses the real backend and can create an account.

- **Required-field validation:** submits the empty registration form, checks the inline required-field messages, and verifies that no registration request is sent.

Steps:
1. Navigate to the storefront.
2. Click Sign in.
3. Click the registration link.
4. Leave all fields empty and country unselected. Clear any autofilled values.
5. Click Register.

Expected:
1. Home page loads.
2. Login form appears.
3. Registration form appears.
4. Form contains no customer details.
5. Registration is prevented, and these messages appear:
   - First name is required
   - Last name is required
   - Date of Birth is required
   - Country is required
   - Postcode is required
   - House number is required
   - Street is required
   - City is required
   - State is required
   - Phone is required
   - Email is required
   - Password is required

## Test data and page objects

- Shared test data is in `test-data/testData.ts`.
- Page objects and grouped locator enums are in `pages/`.
