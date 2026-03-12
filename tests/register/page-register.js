const { expect } = require('@playwright/test');

/**
 * Abre a página de cadastro
 */
const abrirPaginaCadastro = async (page) => {
    await page.goto('/register', { waitUntil: 'domcontentloaded' });
};

/**
 * Preenche o campo de Nome
 */
const preencherNome = async (page, nome) => {
    await page.locator('#user').fill(nome);
};

/**
 * Preenche o campo de E-mail
 */
const preencherEmail = async (page, email) => {
    await page.locator('#email').fill(email);
};

/**
 * Preenche o campo de Senha
 */
const preencherSenha = async (page, senha) => {
    await page.locator('#password').fill(senha);
};

/**
 * Clica no botão Cadastrar
 */
const clicarBotaoCadastrar = async (page) => {
    await page.locator('#btnRegister').click();
};

/**
 * Valida se o cadastro foi realizado com sucesso
 * Espera pela mensagem de sucesso ou redirecionamento
 */
const validarCadastroSucesso = async (page) => {
    // Aguarda um breve tempo para processamento
    await page.waitForTimeout(2000);
    
    // Verifica se voltou à home ou tem mensagem de sucesso
    const currentUrl = page.url();
    
    // Se está em /register, significa que não cadastrou
    // Se saiu de /register, cadastrou com sucesso
    const cadastroFoiBemSucedido = !currentUrl.includes('/register');
    
    expect(cadastroFoiBemSucedido).toBeTruthy();
};

/**
 * Valida se há erro de e-mail duplicado/inválido
 */
const validarErroEmail = async (page) => {
    // Aguarda um breve tempo para validação
    await page.waitForTimeout(1000);
    
    // Verifica se o usuário continua na página de registro
    const currentUrl = page.url();
    const stillOnRegister = currentUrl.includes('/register');
    
    expect(stillOnRegister).toBeTruthy();
};

/**
 * Valida se há erro de senha fraca
 */
const validarErroSenha = async (page) => {
    // A senha mínima é 8 caracteres, validar no campo
    await page.waitForTimeout(500);
    
    const senhaField = page.locator('#password');
    const currentUrl = page.url();
    const stillOnRegister = currentUrl.includes('/register');
    
    expect(stillOnRegister).toBeTruthy();
};

/**
 * Função wrapper para cadastro completo com sucesso
 */
const cadastrarComSucesso = async (page, nome, email, senha) => {
    await abrirPaginaCadastro(page);
    await preencherNome(page, nome);
    await preencherEmail(page, email);
    await preencherSenha(page, senha);
    await clicarBotaoCadastrar(page);
    await validarCadastroSucesso(page);
};

/**
 * Função para preenchimento rápido de formulário
 */
const preencherFormularioCadastro = async (page, { nome, email, senha }) => {
    await preencherNome(page, nome);
    await preencherEmail(page, email);
    await preencherSenha(page, senha);
};

/**
 * Limpa todos os campos do formulário
 */
const limparFormulario = async (page) => {
    await page.locator('#user').clear();
    await page.locator('#email').clear();
    await page.locator('#password').clear();
};

module.exports = {
    abrirPaginaCadastro,
    preencherNome,
    preencherEmail,
    preencherSenha,
    clicarBotaoCadastrar,
    validarCadastroSucesso,
    validarErroEmail,
    validarErroSenha,
    cadastrarComSucesso,
    preencherFormularioCadastro,
    limparFormulario
};
