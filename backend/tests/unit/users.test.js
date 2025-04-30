// backend/tests/unit/users.test.js
process.env.NODE_ENV = 'test';

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn().mockResolvedValue({ rows: [ { id:1, name:'Alice', email:'a@b.com' } ] })
  };
  return { Pool: jest.fn(() => mPool) };
});

const request = require('supertest');
const app = require('../../index');

describe('GET /users', () => {
  it('returns stubbed users array', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id:1, name:'Alice', email:'a@b.com' }]);
  });
});

describe('POST /users', () => {
  it('creates a new user', async () => {
    const newUser = { name: 'Bob', email: 'bob@example.com' };
    const res = await request(app)
      .post('/users')
      .send(newUser);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Usuario agregado' });
  });
});
