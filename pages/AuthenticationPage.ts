import { expect, type Page } from '@playwright/test';
import { NavigationSelectors, SignInPageSelectors } from './ToolShopSelector';

export class AuthenticationPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page.locator(NavigationSelectors.SignInLink)).toBeVisible();
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.page.locator(NavigationSelectors.SignInLink).click();
    const emailInput = this.page.locator(SignInPageSelectors.Email);
    const passwordInput = this.page.locator(SignInPageSelectors.Password);
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await emailInput.fill(email);
    await passwordInput.fill(password);
    await this.page.locator(SignInPageSelectors.Submit).click();
  }

  async signOut(): Promise<void> {
    await this.page.locator(NavigationSelectors.Menu).click();
    await this.page.locator(NavigationSelectors.SignOutLink).click();
  }
}
