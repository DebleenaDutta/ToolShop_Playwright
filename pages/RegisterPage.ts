import { expect, type Page } from '@playwright/test';
import { apiBaseURL } from '../playwright.config';
import { NavigationSelectors, RegisterPageSelectors } from './ToolShopSelector';

export interface RegistrationDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
  postalCode: string;
  houseNumber: string;
  state: string;
  phone: string;
  email: string;
  password: string;
}

export class RegisterPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/');
    await this.page.locator(NavigationSelectors.SignInLink).click();
    await this.page.locator(RegisterPageSelectors.RegisterLink).click();
    await expect(this.page.locator(RegisterPageSelectors.FirstName)).toBeVisible();
  }

  async register(details: RegistrationDetails): Promise<void> {
    await this.open();
    const firstNameInput = this.page.locator(RegisterPageSelectors.FirstName);
    const lastNameInput = this.page.locator(RegisterPageSelectors.LastName);
    const dobInput = this.page.locator(RegisterPageSelectors.DateOfBirth);
    const countrySelect = this.page.locator(RegisterPageSelectors.Country);
    const postcodeInput = this.page.locator(RegisterPageSelectors.PostalCode);
    const houseNumberInput = this.page.locator(RegisterPageSelectors.HouseNumber);
    const stateInput = this.page.locator(RegisterPageSelectors.State);
    const phoneInput = this.page.locator(RegisterPageSelectors.Phone);
    const emailInput = this.page.locator(RegisterPageSelectors.Email);
    const passwordInput = this.page.locator(RegisterPageSelectors.Password);

    await expect(firstNameInput).toBeVisible();
    await expect(lastNameInput).toBeVisible();
    await expect(dobInput).toBeVisible();
    await expect(countrySelect).toBeVisible();
    await this.page.waitForFunction(() => {
      const select = document.querySelector('[data-test="country"]') as HTMLSelectElement | null;
      return !!select && Array.from(select.options).some((option) => option.value && option.value !== '');
    });

    await firstNameInput.fill(details.firstName);
    await lastNameInput.fill(details.lastName);
    await dobInput.fill(details.dateOfBirth);
    await countrySelect.selectOption(details.country);
    await postcodeInput.fill(details.postalCode);
    const postcodeLookupResponse = this.page.waitForResponse((response) => {
      const url = new URL(response.url());
      return (
        url.origin === apiBaseURL &&
        url.pathname === '/postcode-lookup' &&
        url.searchParams.get('country') === details.country &&
        url.searchParams.get('postcode') === details.postalCode &&
        url.searchParams.get('house_number') === details.houseNumber
      );
    });
    await houseNumberInput.fill(details.houseNumber);
    await postcodeLookupResponse;
    await stateInput.fill(details.state);
    await phoneInput.fill(details.phone);
    await emailInput.fill(details.email);
    await passwordInput.fill(details.password);
    await this.submit();
  }

  async submit(): Promise<void> {
    await this.page.locator(RegisterPageSelectors.Submit).click();
  }
}
