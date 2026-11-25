import { expect, test } from '@playwright/test';

test('homepage explains the marketplace and offers cookie choices', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Angelpage/);
  await expect(
    page.getByRole('button', { name: 'Cookie settings' })
  ).toBeVisible();
});

test('faq page publishes its canonical URL and a real answer', async ({
  page,
}) => {
  await page.goto('/faq');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /\/faq$/
  );
  await expect(
    page.getByRole('heading', { name: 'What is Angelpage?' })
  ).toBeVisible();
});
