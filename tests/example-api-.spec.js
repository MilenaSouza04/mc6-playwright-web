// @ts-check
const { test, expect } = require('@playwright/test');

// Definindo a URL base para facilitar manutenção
const BASE_URL = 'https://restful-booker.herokuapp.com';

test('Consultando as reservas cadastradas (Lista)', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/booking`);
  
  // Debug seguro (status)
  console.log(`Status Code: ${response.status()}`);
  
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
});

test('Consultando uma reserva específica por ID (Fluxo Completo)', async ({ request }) => {
  // 1. PRIMEIRO: Criamos uma reserva para garantir que o ID existe
  const createResponse = await request.post(`${BASE_URL}/booking`, {
    data: {
      "firstname": "John",
      "lastname": "Smith",
      "totalprice": 111,
      "depositpaid": true,
      "bookingdates": { "checkin": "2018-01-01", "checkout": "2019-01-01" },
      "additionalneeds": "Breakfast"
    }
  });
  const createBody = await createResponse.json();
  const bookingId = createBody.bookingid; // Pegamos o ID gerado dinamicamente

  // 2. AGORA: Testamos o GET usando esse ID que sabemos que existe
  const response = await request.get(`${BASE_URL}/booking/${bookingId}`);
  const jsonBody = await response.json();
  
  console.log(jsonBody);

  // Verificando se os dados da reserva estão corretos
  expect(jsonBody.firstname).toBe('John');
  expect(jsonBody.lastname).toBe('Smith');
  expect(jsonBody.totalprice).toBe(111);
  expect(jsonBody.depositpaid).toBeTruthy();
  expect(jsonBody.bookingdates.checkin).toBe('2018-01-01');
  expect(jsonBody.bookingdates.checkout).toBe('2019-01-01');
  expect(jsonBody.additionalneeds).toBe('Breakfast');

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
});

test('Validando apenas os campos de uma reserva', async ({ request }) => {
  // 1. Criamos a reserva para ter um ID válido
  const createResponse = await request.post(`${BASE_URL}/booking`, {
    data: {
      "firstname": "Teste", "lastname": "Campos", "totalprice": 100,
      "depositpaid": true, "bookingdates": { "checkin": "2023-01-01", "checkout": "2023-01-02" },
      "additionalneeds": "Lunch"
    }
  });
  const bookingId = (await createResponse.json()).bookingid;

  // 2. Fazemos o GET nesse ID
  const response = await request.get(`${BASE_URL}/booking/${bookingId}`);
  const jsonBody = await response.json();
  
  console.log(jsonBody);

  // Verificando a estrutura do objeto (Schema check simples)
  expect(jsonBody).toHaveProperty('firstname');
  expect(jsonBody).toHaveProperty('lastname');
  expect(jsonBody).toHaveProperty('totalprice');
  expect(jsonBody).toHaveProperty('depositpaid');
  expect(jsonBody).toHaveProperty('bookingdates');
  expect(jsonBody).toHaveProperty('additionalneeds');

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
});

test('Cadastrando uma reserva', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/booking`, {
    data: {
      "firstname": "Milena",
      "lastname": "Souza",
      "totalprice": 222,
      "depositpaid": true,
      "bookingdates": {
        "checkin": "2018-01-01",
        "checkout": "2019-01-01"
      },
      "additionalneeds": "Breakfast"
    }
  });

  console.log(`Status Code: ${response.status()}`);
  
  // Nota: Removi response.text() aqui para não quebrar o response.json() abaixo
  const responseBody = await response.json();
  console.log(responseBody);

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  expect(responseBody.booking).toHaveProperty("firstname", "Milena");
  expect(responseBody.booking).toHaveProperty("lastname", "Souza");
  expect(responseBody.booking).toHaveProperty("totalprice", 222);
  expect(responseBody.booking).toHaveProperty("depositpaid", true);
});

test('Gerando um token herbertao @regressivo', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/auth`, {
    data: {
      "username": "admin",
      "password": "password123"
    }
  });

  console.log(`Status Code: ${response.status()}`);

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  const tokenRecebido = responseBody.token;
  console.log("Seu token é: " + tokenRecebido);
});

test('Atualização parcial (PATCH)', async ({ request }) => {
  // PASSO 1: Gerar Token
  const authResponse = await request.post(`${BASE_URL}/auth`, {
    data: { "username": "admin", "password": "password123" }
  });
  const token = (await authResponse.json()).token;
  console.log("Token gerado: " + token);

  // PASSO 2: Criar uma reserva para ser atualizada (Evita erro 404/405)
  const createResponse = await request.post(`${BASE_URL}/booking`, {
    data: {
      "firstname": "Original", "lastname": "Name", "totalprice": 100,
      "depositpaid": true, "bookingdates": { "checkin": "2023-01-01", "checkout": "2023-01-05" },
      "additionalneeds": "Dinner"
    }
  });
  const bookingId = (await createResponse.json()).bookingid;
  console.log("Reserva criada para update com ID: " + bookingId);

  // PASSO 3: Atualizar a reserva criada
  const partialUpdateRequest = await request.patch(`${BASE_URL}/booking/${bookingId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cookie': `token=${token}`
    },
    data: {
      "firstname": "Milena",
      "lastname": "Souza",
      "totalprice": 111,
      "depositpaid": false
    }
  });

  // Validações
  expect(partialUpdateRequest.ok()).toBeTruthy();
  expect(partialUpdateRequest.status()).toBe(200);

  const partialUpdatedResponseBody = await partialUpdateRequest.json();
  console.log(partialUpdatedResponseBody);

  expect(partialUpdatedResponseBody).toHaveProperty("firstname", "Milena");
  expect(partialUpdatedResponseBody).toHaveProperty("lastname", "Souza");
  expect(partialUpdatedResponseBody).toHaveProperty("totalprice", 111);
  expect(partialUpdatedResponseBody).toHaveProperty("depositpaid", false);
});