import { expect, type Page } from '@playwright/test';
import {
  NavigationSelectors,
  ProductCatalogPageSelectors,
  ProductDetailsPageSelectors,
} from './ToolShopSelector';

export class ProductCatalogPage {
  constructor(private readonly page: Page) {}

  async addItemToCart(productName: string): Promise<void> {
    await this.page.locator(NavigationSelectors.HomeLink).click();
    const searchInput = this.page.locator(ProductCatalogPageSelectors.SearchQuery);
    await expect(searchInput).toBeVisible();
    await searchInput.fill(productName);
    await this.page.locator(ProductCatalogPageSelectors.SearchSubmit).click();
    await this.page.getByRole('heading', { name: productName, exact: true }).click();
    await this.page.locator(ProductDetailsPageSelectors.AddToCart).click();
  }
}
