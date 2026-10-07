import { test, expect } from '@playwright/test';
import { AuthenticationPage } from '../pages/AuthenticationPage';
import { SignInPageSelectors, AccountPageSelectors, NavigationSelectors } from '../pages/ToolShopSelector';
import { apiBaseURL, checkoutCredentials } from '../playwright.config';
import { testData } from '../test-data/testData';

// Verifies a customer can sign in, view their account, and sign out.
test('validate successful login and logout', async ({ page }) => {
  const authenticationPage = new AuthenticationPage(page);
  await authenticationPage.open();
  const loginResponse = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return url.origin === apiBaseURL && url.pathname === '/users/login' && response.request().method() === 'POST';
  });
  await authenticationPage.signIn(checkoutCredentials.email, checkoutCredentials.password);
  expect((await loginResponse).status()).toBe(200);
  await page.waitForLoadState('networkidle');
  await expect(page.locator(AccountPageSelectors.Title)).toContainText('My account');
  await expect(page.locator(NavigationSelectors.Menu)).toContainText(checkoutCredentials.username);
  await authenticationPage.signOut();
  await page.waitForLoadState('networkidle');
  await expect(page.locator(NavigationSelectors.SignInLink)).toContainText('Sign in');
});

test('validate unsuccessful login with invalid credentials', async ({ page }) => {
  const authenticationPage = new AuthenticationPage(page);
  await authenticationPage.open();
  const loginResponse = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return url.origin === apiBaseURL && url.pathname === '/users/login' && response.request().method() === 'POST';
  });
  await authenticationPage.signIn(testData.invalidAccount.email, testData.invalidAccount.password);
  expect((await loginResponse).status()).toBe(401);
  await expect(page.locator(SignInPageSelectors.ErrorLogin)).toContainText('Invalid email or password');
});