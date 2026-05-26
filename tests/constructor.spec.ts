import { test, expect } from '@playwright/test';

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    // Перехватываем запросы
    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({ path: './tests/mocks/ingredients.json' });
    });

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({ path: './tests/mocks/user.json' });
    });

    // Подставляем токены
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token-67890');
      document.cookie = 'accessToken=mock-access-token-12345; path=/';
    });

    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    // Очищаем токены после каждого теста
    await page.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie =
        'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
  });

  test('должен добавить ингредиент в конструктор', async ({ page }) => {
    const ingredient = page.locator(
      '[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]'
    );
    const addButton = ingredient.locator('button', { hasText: 'Добавить' });

    // Считаем количество элементов в конструкторе до добавления
    const initialCount = await page.locator('.constructor-element').count();

    // Добавляем ингредиент
    await addButton.click();

    // Ждём, пока количество увеличится
    await expect(async () => {
      const newCount = await page.locator('.constructor-element').count();
      expect(newCount).toBe(initialCount + 1);
    }).toPass();
  });

  test('должен открыть модальное окно ингредиента', async ({ page }) => {
    await page
      .locator('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]')
      .click();
    await expect(page.locator('[data-testid="modal"]')).toBeVisible();
  });

  test('должен закрыть модальное окно по крестику', async ({ page }) => {
    await page
      .locator('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]')
      .click();
    await expect(page.locator('[data-testid="modal"]')).toBeVisible();
    await page.locator('[data-testid="modal-close"]').click();
    await expect(page.locator('[data-testid="modal"]')).not.toBeVisible();
  });

  test('должен отобразить правильные данные ингредиента в модалке', async ({
    page
  }) => {
    await page
      .locator('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]')
      .click();
    await expect(page.locator('[data-testid="modal"]')).toContainText(
      'Краторная булка N-200i'
    );
    await expect(page.locator('[data-testid="modal"]')).toContainText('420');
  });

  test('должен создать заказ', async ({ page }) => {
    await page.route('**/api/orders', async (route) => {
      expect(route.request().headers()['authorization']).toBe(
        'mock-access-token-12345'
      );
      await route.fulfill({ path: './tests/mocks/order-success.json' });
    });

    // Добавляем ингредиенты
    await page
      .locator('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"] button')
      .click();
    await page
      .locator('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"] button')
      .click();

    // Оформляем заказ
    await page.locator('button', { hasText: 'Оформить заказ' }).click();

    // Проверяем модалку с заказом
    await expect(page.locator('[data-testid="modal"]')).toBeVisible();
    await expect(page.locator('[data-testid="modal"]')).toContainText('54321');

    // Закрываем модалку
    await page.locator('[data-testid="modal-close"]').click();
  });
});
