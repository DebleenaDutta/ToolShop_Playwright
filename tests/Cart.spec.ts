import { test, expect, type APIRequestContext } from '@playwright/test';
import { ProductCatalogPage } from '../pages/ProductCatalogPage';
import { ProductDetailsPageSelectors } from '../pages/ToolShopSelector';
import { apiBaseURL } from '../playwright.config';
import { testData } from '../test-data/testData';

async function findProductIds(
  request: APIRequestContext,
  names: string[],
): Promise<Record<string, string>> {
  const response = await request.get(
    `${apiBaseURL}/products/search?q=${encodeURIComponent(names[0])}`,
  );
  expect(response.status()).toBe(200);

  const { data } = (await response.json()) as {
    data: Array<{ id: string; name: string }>;
  };
  return Object.fromEntries(
    names.map((name) => {
      const product = data.find((item) => item.name === name);
      if (!product) {
        throw new Error(`Product "${name}" was not found in the catalog`);
      }
      return [name, product.id];
    }),
  );
}

// Verifies a customer can find a product and add it to their cart.
test('adds a searched product to the cart', async ({ page, request }) => {
  const productCatalogPage = new ProductCatalogPage(page);
  const { [testData.cart.productName]: productId } = await findProductIds(request, [
    testData.cart.productName,
  ]);

  await page.goto('/');  
  const cartItemRequestPromise = page.waitForRequest((request) => {
    const url = new URL(request.url());
    return (
      url.origin === apiBaseURL &&
      /^\/carts\/[^/]+$/.test(url.pathname) &&
      request.method() === 'POST'
    );
  });
  const cartItemResponsePromise = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return (
      url.origin === apiBaseURL &&
      /^\/carts\/[^/]+$/.test(url.pathname) &&
      response.request().method() === 'POST'
    );
  });

  await productCatalogPage.addItemToCart(testData.cart.productName);

  const cartItemRequest = await cartItemRequestPromise;
  expect(cartItemRequest.postDataJSON()).toEqual({
    product_id: productId,
    quantity: 1,
  });
  expect((await cartItemResponsePromise).status()).toBe(200);
  await expect(page.locator(ProductDetailsPageSelectors.AddToCartAlert)).toContainText(
    'Product added to shopping cart',
  );
});

// Verifies deleting one product leaves the other cart item intact.
test('removes a product from the cart and validates the remaining item', async ({ request }) => {
  const {
    [testData.cart.productName]: productId,
    [testData.cart.retainedProductName]: retainedProductId,
  } = await findProductIds(request, [
    testData.cart.productName,
    testData.cart.retainedProductName,
  ]);

  const createCartResponse = await request.post(`${apiBaseURL}/carts`, { data: {} });
  expect(createCartResponse.status()).toBe(201);
  const { id: cartId } = (await createCartResponse.json()) as { id: string };
  expect(cartId).toBeTruthy();

  const products = [productId, retainedProductId];
  for (const id of products) {
    const addItemResponse = await request.post(`${apiBaseURL}/carts/${cartId}`, {
      data: { product_id: id, quantity: 1 },
    });
    expect(addItemResponse.status()).toBe(200);
  }

  const cartBeforeDeleteResponse = await request.get(`${apiBaseURL}/carts/${cartId}`);
  expect(cartBeforeDeleteResponse.status()).toBe(200);
  const cartBeforeDelete = (await cartBeforeDeleteResponse.json()) as {
    cart_items: Array<{ product_id: string; quantity: number }>;
  };
  expect(cartBeforeDelete.cart_items).toHaveLength(products.length);
  expect(
    cartBeforeDelete.cart_items.map(({ product_id, quantity }) => ({ product_id, quantity })),
  ).toEqual(expect.arrayContaining(products.map((product_id) => ({ product_id, quantity: 1 }))));

  const deleteResponse = await request.delete(
    `${apiBaseURL}/carts/${cartId}/product/${productId}`,
  );
  expect(deleteResponse.status()).toBe(204);

  const cartAfterDeleteResponse = await request.get(`${apiBaseURL}/carts/${cartId}`);
  expect(cartAfterDeleteResponse.status()).toBe(200);
  const cartAfterDelete = (await cartAfterDeleteResponse.json()) as {
    cart_items: Array<{ product_id: string; quantity: number }>;
  };
  expect(
    cartAfterDelete.cart_items.map(({ product_id, quantity }) => ({ product_id, quantity })),
  ).toEqual([{ product_id: retainedProductId, quantity: 1 }]);
});
