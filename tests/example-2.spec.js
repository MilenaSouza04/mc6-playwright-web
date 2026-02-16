const { test, expect } = require('@playwright/test');

test('Fazendo login na qazando', async ({ page }) => {
  await page.goto('https://automationpratice.com.br/login');
  await page.locator('#user').fill('qazando@gmail.com');
  await page.locator('#password').fill('123456');
  await page.getByRole('button', { name: 'login' }).click();
  await expect(page.getByText('Olá, qazando@gmail.com')).toBeVisible();
});

test('Fazendo o teste de cadastro', async ({ page }) => {
  await page.goto('/register');
  await page.locator('#user').fill('herbert soares');
  await page.locator('#email').fill('qazando@gmail.com');
  await page.locator('#password').fill('123456');
  await page.getByRole('button', { name: 'Cadastrar' }).click();
});

