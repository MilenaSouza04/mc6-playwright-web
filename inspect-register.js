const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://automationpratice.com.br/register', { waitUntil: 'networkidle' });
  
  // Aguardar carregamento
  await page.waitForTimeout(2000);
  
  // Pegar todos os inputs do formulário
  const inputs = await page.evaluate(() => {
    const inputElements = document.querySelectorAll('input');
    const result = [];
    
    inputElements.forEach(input => {
      if (input.offsetParent !== null || input.type !== 'hidden') { // visible elements
        result.push({
          id: input.id,
          name: input.name,
          type: input.type,
          placeholder: input.placeholder,
          className: input.className,
          parentLabel: input.parentElement?.textContent?.slice(0, 50) || 'N/A'
        });
      }
    });
    
    return result;
  });
  
  // Pegar todos os buttons
  const buttons = await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    const result = [];
    
    btns.forEach(btn => {
      result.push({
        text: btn.textContent.trim(),
        type: btn.type,
        id: btn.id,
        className: btn.className,
        onClick: btn.onclick ? 'yes' : 'no'
      });
    });
    
    return result;
  });
  
  // Buscar elemento com text "cadastr"
  const registerSection = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent.toLowerCase().includes('cadastro') || 
      el.textContent.toLowerCase().includes('cadastrar')
    );
    return elements.slice(0, 5).map(el => ({
      tag: el.tagName,
      text: el.textContent.slice(0, 100),
      id: el.id,
      className: el.className
    }));
  });
  
  console.log('\n=== INPUTS ENCONTRADOS ===\n');
  console.log(JSON.stringify(inputs, null, 2));
  
  console.log('\n=== BUTTONS ENCONTRADOS ===\n');
  console.log(JSON.stringify(buttons, null, 2));
  
  console.log('\n=== ELEMENTOS COM "CADASTRO" ===\n');
  console.log(JSON.stringify(registerSection, null, 2));
  
  // Pegar HTML da seção de cadastro
  const pageHtml = await page.content();
  const match = pageHtml.match(/cadastr[\s\S]{0,1000}?(?=cadastr|$)/i);
  
  console.log('\n=== HTML SNIPPET (CADASTRO) ===\n');
  if (match) {
    console.log(match[0].slice(0, 2000));
  }
  
  await browser.close();
})();
