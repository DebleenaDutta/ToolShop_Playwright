import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { testData } from '../test-data/testData';
import { apiBaseURL } from '../playwright.config';
import { RegisterPageSelectors } from '../pages/ToolShopSelector';

// Verifies the form submits registration details and handles a mocked API success.
test('submits registration details to the register API', async ({ page }) => {
  const registerPage = new RegisterPage(page);

  await page.route('**/users/register', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Registration successful' }),
    });
  });

  const registrationRequestPromise = page.waitForRequest((request) => {
    const url = new URL(request.url());
    return url.origin === apiBaseURL && url.pathname === '/users/register' && request.method() === 'POST';
  });
  const registrationResponsePromise = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return url.origin === apiBaseURL && url.pathname === '/users/register' && response.request().method() === 'POST';
  });
  const postcodeLookupRequestPromise = page.waitForRequest((request) => {
    const url = new URL(request.url());
    return (
      url.origin === apiBaseURL &&
      url.pathname === '/postcode-lookup' &&
      url.searchParams.get('country') === testData.registration.country &&
      url.searchParams.get('postcode') === testData.registration.postalCode &&
      url.searchParams.get('house_number') === testData.registration.houseNumber
    );
  });
  await registerPage.register(testData.registration);

  const registrationRequest = await registrationRequestPromise;
  const registration = testData.registration;
  expect(registrationRequest.postDataJSON()).toMatchObject({
    first_name: registration.firstName,
    last_name: registration.lastName,
    dob: registration.dateOfBirth,
    phone: registration.phone,
    email: registration.email,
    password: registration.password,
    address: {
      state: registration.state,
      country: registration.country,
      postal_code: registration.postalCode,
    },
  });
  expect((await registrationResponsePromise).status()).toBe(201);

  const postcodeLookupRequest = new URL((await postcodeLookupRequestPromise).url());
  expect(postcodeLookupRequest.searchParams.get('country')).toBe(registration.country);
  expect(postcodeLookupRequest.searchParams.get('postcode')).toBe(registration.postalCode);
  expect(postcodeLookupRequest.searchParams.get('house_number')).toBe(registration.houseNumber);
});

// Verifies required-field errors appear without sending invalid data to the API.
test('shows required-field errors when submitting an empty registration form', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  let registrationRequestCount = 0;

  await page.route('**/users/register', async (route) => {
    registrationRequestCount += 1;
    await route.fulfill({
      status: 422,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });

  await registerPage.open();
  await registerPage.submit();

  await expect(page.locator(RegisterPageSelectors.FirstNameError)).toContainText('First name is required');
  await expect(page.locator(RegisterPageSelectors.LastNameError)).toContainText('Last name is required');
  await expect(page.locator(RegisterPageSelectors.DateOfBirthError)).toContainText('Date of Birth is required');
  await expect(page.locator(RegisterPageSelectors.CountryError)).toContainText('Country is required');
  await expect(page.locator(RegisterPageSelectors.PostalCodeError)).toContainText('Postcode is required');
  await expect(page.locator(RegisterPageSelectors.HouseNumberError)).toContainText('House number is required');
  await expect(page.locator(RegisterPageSelectors.StreetError)).toContainText('Street is required');
  await expect(page.locator(RegisterPageSelectors.CityError)).toContainText('City is required');
  await expect(page.locator(RegisterPageSelectors.StateError)).toContainText('State is required');
  await expect(page.locator(RegisterPageSelectors.PhoneError)).toContainText('Phone is required');
  await expect(page.locator(RegisterPageSelectors.EmailError)).toContainText('Email is required');
  await expect(page.locator(RegisterPageSelectors.PasswordError)).toContainText('Password is required');
  expect(registrationRequestCount).toBe(0);
});
