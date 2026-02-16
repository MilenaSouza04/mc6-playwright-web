const { expect } = require('@playwright/test');

const abrirSite = async (page) => {
    await page.goto('/login');
}

const digitarEmail = async (page) => {
    await page.locator('#user').fill('qazando@gmail.com');
}

const digitarSenha = async (page) => {
    await page.locator('#password').fill('123456');
}

const clicarBotaoLogin = async (page) => {
    await page.getByRole('button', { name: 'login' }).click();
}

const validarLoginSucesso = async (page) => {
    await expect(page.getByText('Olá, qazando@gmail.com')).toBeVisible();
}

const loginComSucesso = async (page) => {
    await abrirSite(page);
    await digitarEmail(page);
    await digitarSenha(page);
    await clicarBotaoLogin(page);
    await validarLoginSucesso(page);    
}

module.exports = {
    abrirSite,
    digitarEmail,
    digitarSenha,
    clicarBotaoLogin,
    validarLoginSucesso,
    loginComSucesso
}