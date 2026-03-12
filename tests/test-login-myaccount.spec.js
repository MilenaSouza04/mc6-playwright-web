import { test, expect } from '@playwright/test';

test('Login com sucesso validando redirecionamento para my-account', async ({ page }) => {
  // 1. Abrir o site da qazando na página de login
  await page.goto('https://automationpratice.com.br/login');
  
  // 2. Digitar o e-mail: qazandonovo@gmail.com
  await page.locator('#user').fill('qazandonovo@gmail.com');
  
  // 3. Digitar a senha: 123456
  await page.locator('#password').fill('123456');
  
  // 4. Clicar em login (botão)
  await page.getByRole('button', { name: 'login' }).click();
  
  // 5. Validar se foi encaminhado para https://automationpratice.com.br/my-account
  await expect(page).toHaveURL('https://automationpratice.com.br/my-account');
});
