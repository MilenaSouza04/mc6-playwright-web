import {test, expect} from '@playwright/test';
const {abrirSite, digitarEmail, digitarSenha, clicarBotaoLogin, validarLoginSucesso, loginComSucesso} = require('./page-login');

test('Cenario 1 - Login 1 com sucesso', async ({page}) => {
    await abrirSite(page);
    await digitarEmail(page);
    await digitarSenha(page);
    await clicarBotaoLogin(page);
    await validarLoginSucesso(page);    
});

test('Cenario 2 - Login 2', async ({page}) => {
    await loginComSucesso(page); 
});