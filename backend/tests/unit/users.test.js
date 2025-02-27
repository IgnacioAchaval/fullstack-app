const request = require('supertest');
const app = require('../../index.js'); // tu archivo principal de Express

describe('GET /users', () => {
  it('should return an array of users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});