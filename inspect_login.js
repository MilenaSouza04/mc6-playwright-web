const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://automationpratice.com.br/login');
  
  console.log('=== INSPECIONANDO PÁGINA DE LOGIN ===\n');
  
  // Procurar todos os inputs
  const inputs = await page.locator('input').all();
  console.log(`Total de inputs encontrados: ${inputs.length}\n`);
  
  for (let input of inputs) {
    const id = await input.getAttribute('id');
    const type = await input.getAttribute('type');
    const placeholder = await input.getAttribute('placeholder');
    console.log(`Input - ID: ${id}, Type: ${type}, Placeholder: ${placeholder}`);
  }
  
  console.log('\n=== PROCURANDO BOTÕES ===\n');
  
  // Procurar botões
  const buttons = await page.locator('button').all();
  for (let button of buttons) {
    const id = await button.getAttribute('id');
    const text = await button.textContent();
    console.log(`Button - ID: ${id}, Text: ${text?.trim()}`);
  }
  
  await browser.close();
})();
