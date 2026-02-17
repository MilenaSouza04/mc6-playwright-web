// @ts-check
const { test, expect } = require('@playwright/test');

// Se você não tiver baseURL configurado no playwright.config, 
// defina a URL completa aqui. Se tiver, pode usar apenas '/auth' e '/booking'
const BASE_URL = 'https://restful-booker.herokuapp.com';

test('deve ser capaz de atualizar parcialmente os detalhes da reserva', async ({ request }) => {

    // 1. Criar o Token (Auth)
    const responseAuth = await request.post(`${BASE_URL}/auth`, {
        data: {
            "username": "admin",
            "password": "password123"
        }
    });
    expect(responseAuth.ok()).toBeTruthy();
    expect(responseAuth.status()).toBe(200);
    
    const tokenBody = await responseAuth.json();
    const token = tokenBody.token;
    console.log("O novo Token eh: " + token);

    // 2. CRIAR uma reserva nova (Para ter um ID válido e evitar erro 404)
    const createResponse = await request.post(`${BASE_URL}/booking`, {
        data: {
            "firstname": "Jim",
            "lastname": "Brown",
            "totalprice": 111,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2018-01-01",
                "checkout": "2019-01-01"
            },
            "additionalneeds": "Breakfast"
        }
    });
    expect(createResponse.ok()).toBeTruthy();
    const createBody = await createResponse.json();
    const bookingId = createBody.bookingid;
    console.log("Reserva criada com ID: " + bookingId);

    // 3. Atualizar (PATCH) usando o ID que acabamos de criar
    const partialUpdateRequest = await request.patch(`${BASE_URL}/booking/${bookingId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': `token=${token}`
        },
        data: {
            "firstname": "Sim",
            "lastname": "Son",
            "totalprice": 333,
            "depositpaid": false
        }
    });

    // Verificações
    console.log(`Status Update: ${partialUpdateRequest.status()}`);
    expect(partialUpdateRequest.ok()).toBeTruthy();
    expect(partialUpdateRequest.status()).toBe(200);

    const partialUpdatedResponseBody = await partialUpdateRequest.json();
    console.log(partialUpdatedResponseBody);

    expect(partialUpdatedResponseBody).toHaveProperty("firstname", "Sim");
    expect(partialUpdatedResponseBody).toHaveProperty("lastname", "Son");
    expect(partialUpdatedResponseBody).toHaveProperty("totalprice", 333);
    expect(partialUpdatedResponseBody).toHaveProperty("depositpaid", false);
});