import { test, expect } from '@playwright/test';
const {
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
} = require('./page-register');

test.describe('Testes de Cadastro - Automationpratice', () => {
    
    test.beforeEach(async ({ page }) => {
        // Antes de cada teste, abre a página de cadastro
        await abrirPaginaCadastro(page);
    });

    test('Cenário 1 - Cadastro com sucesso (dados válidos)', async ({ page }) => {
        // Arrange
        const dados = {
            nome: 'João Silva',
            email: `joao.silva.${Date.now()}@example.com`,
            senha: 'Senha123456'
        };

        // Act
        await preencherNome(page, dados.nome);
        await preencherEmail(page, dados.email);
        await preencherSenha(page, dados.senha);
        await clicarBotaoCadastrar(page);

        // Assert
        await validarCadastroSucesso(page);
    });

    test('Cenário 2 - Cadastro com valores aleatórios', async ({ page }) => {
        // Arrange
        const timestamp = Date.now();
        const dados = {
            nome: `Usuario${timestamp}`,
            email: `user${timestamp}@test.com.br`,
            senha: 'Senha@123456'
        };

        // Act
        await preencherFormularioCadastro(page, dados);
        await clicarBotaoCadastrar(page);

        // Assert
        await validarCadastroSucesso(page);
    });

    test('Cenário 3 - Tentativa de cadastro com campos vazios', async ({ page }) => {
        // Act - Tenta clicar no botão sem preencher nada
        await clicarBotaoCadastrar(page);

        // Assert - Deve permanecer na página de registro
        const url = page.url();
        expect(url).toContain('/register');
    });

    test('Cenário 4 - Cadastro sem preencher nome', async ({ page }) => {
        // Arrange
        const dados = {
            email: `test${Date.now()}@example.com`,
            senha: 'Senha123456'
        };

        // Act
        await preencherEmail(page, dados.email);
        await preencherSenha(page, dados.senha);
        await clicarBotaoCadastrar(page);

        // Assert - Deve permanecer na página
        const url = page.url();
        expect(url).toContain('/register');
    });

    test('Cenário 5 - Cadastro sem preencher e-mail', async ({ page }) => {
        // Arrange
        const dados = {
            nome: 'Teste Usuario',
            senha: 'Senha123456'
        };

        // Act
        await preencherNome(page, dados.nome);
        await preencherSenha(page, dados.senha);
        await clicarBotaoCadastrar(page);

        // Assert
        const url = page.url();
        expect(url).toContain('/register');
    });

    test('Cenário 6 - Senha com menos de 8 caracteres', async ({ page }) => {
        // Arrange
        const dados = {
            nome: 'João Teste',
            email: `js${Date.now()}@example.com`,
            senha: '123456' // Apenas 6 caracteres
        };

        // Act
        await preencherNome(page, dados.nome);
        await preencherEmail(page, dados.email);
        
        // Tentar preencher senha curta
        const senhaField = page.locator('#password');
        await senhaField.fill(dados.senha);

        // Assert - Campo tem minlength="8"
        const senhaLength = await senhaField.evaluate(el => el.value.length);
        expect(senhaLength).toBeLessThan(8);

        // Tentar enviar sem preencher completamente
        await clicarBotaoCadastrar(page);
        
        const url = page.url();
        expect(url).toContain('/register');
    });

    test('Cenário 7 - E-mail em formato inválido', async ({ page }) => {
        // Arrange
        const dados = {
            nome: 'Teste Email',
            email: 'emailinvalido.com.br', // Sem @
            senha: 'Senha123456'
        };

        // Act
        await preencherNome(page, dados.nome);
        await preencherEmail(page, dados.email);
        await preencherSenha(page, dados.senha);

        // Assert - O input do tipo email deve estar com valor, mas validação HTML pode não permitir
        const emailField = page.locator('#email');
        const emailValue = await emailField.inputValue();
        expect(emailValue).toBe(dados.email);

        // Tentar enviar
        await clicarBotaoCadastrar(page);
        
        // Deve permanecer na página
        const url = page.url();
        expect(url).toContain('/register');
    });

    test('Cenário 8 - Limpar e refazer cadastro', async ({ page }) => {
        // Arrange
        const dados1 = {
            nome: 'Primeiro Cadastro',
            email: `primeiro${Date.now()}@test.com`,
            senha: 'Senha123456'
        };

        // Act - Preenche formulário
        await preencherFormularioCadastro(page, dados1);
        
        // Verifica preenchimento
        let nomeValue = await page.locator('#user').inputValue();
        expect(nomeValue).toBe(dados1.nome);

        // Limpa formulário
        await limparFormulario(page);

        // Verifica se limpou
        nomeValue = await page.locator('#user').inputValue();
        expect(nomeValue).toBe('');

        // Preenche com novos dados
        const dados2 = {
            nome: 'Segundo Cadastro',
            email: `segundo${Date.now()}@test.com`,
            senha: 'SenhaOutra123456'
        };

        await preencherFormularioCadastro(page, dados2);

        // Assert
        nomeValue = await page.locator('#user').inputValue();
        expect(nomeValue).toBe(dados2.nome);
    });

    test('Cenário 9 - Múltiplos cadastros sequenciais', async ({ page }) => {
        // Arrange - Dados para múltiplos cadastros
        const usuarios = [
            {
                nome: 'Usuario Um',
                email: `user1${Date.now()}@example.com`,
                senha: 'Senha123456'
            },
            {
                nome: 'Usuario Dois',
                email: `user2${Date.now()}@example.com`,
                senha: 'SenhaOutra123456'
            }
        ];

        // Act & Assert - Cadastra primeiro usuário
        await preencherFormularioCadastro(page, usuarios[0]);
        await clicarBotaoCadastrar(page);
        await validarCadastroSucesso(page);

        // Act & Assert - Volta e cadastra segundo usuário
        await abrirPaginaCadastro(page);
        await preencherFormularioCadastro(page, usuarios[1]);
        await clicarBotaoCadastrar(page);
        await validarCadastroSucesso(page);
    });

    test('Cenário 10 - Validar campos mantêm valores após validação', async ({ page }) => {
        // Arrange
        const dados = {
            nome: 'Test User',
            email: `test${Date.now()}@example.com`,
            senha: 'Pass123456'
        };

        // Act
        await preencherFormularioCadastro(page, dados);

        // Assert - Verifica valores preenchidos
        const nomeValue = await page.locator('#user').inputValue();
        const emailValue = await page.locator('#email').inputValue();
        const senhaValue = await page.locator('#password').inputValue();

        expect(nomeValue).toBe(dados.nome);
        expect(emailValue).toBe(dados.email);
        expect(senhaValue).toBe(dados.senha);
    });
});
