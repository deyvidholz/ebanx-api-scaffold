import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

beforeEach(async () => {
  await request(app).post('/reset');
});

describe('POST /reset', () => {
  it('returns 200', async () => {
    const res = await request(app).post('/reset');
    expect(res.status).toBe(200);
  });
});

describe('GET /balance', () => {
  it('returns 404 for a non-existing account', async () => {
    const res = await request(app).get('/balance?account_id=1234');
    expect(res.status).toBe(404);
    expect(res.body).toBe(0);
  });

  it('returns 200 with balance for an existing account', async () => {
    await request(app)
      .post('/event')
      .send({ type: 'deposit', destination: '100', amount: 20 });

    const res = await request(app).get('/balance?account_id=100');
    expect(res.status).toBe(200);
    expect(res.body).toBe(20);
  });
});

describe('POST /event', () => {
  describe('deposit', () => {
    it('creates account with initial balance', async () => {
      const res = await request(app)
        .post('/event')
        .send({ type: 'deposit', destination: '100', amount: 10 });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ destination: { id: '100', balance: 10 } });
    });

    it('adds amount to an existing account', async () => {
      await request(app).post('/event').send({ type: 'deposit', destination: '100', amount: 10 });

      const res = await request(app)
        .post('/event')
        .send({ type: 'deposit', destination: '100', amount: 10 });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ destination: { id: '100', balance: 20 } });
    });
  });

  describe('withdraw', () => {
    it('returns 404 for a non-existing account', async () => {
      const res = await request(app)
        .post('/event')
        .send({ type: 'withdraw', origin: '200', amount: 10 });

      expect(res.status).toBe(404);
      expect(res.body).toBe(0);
    });

    it('deducts amount from an existing account', async () => {
      await request(app).post('/event').send({ type: 'deposit', destination: '100', amount: 20 });

      const res = await request(app)
        .post('/event')
        .send({ type: 'withdraw', origin: '100', amount: 5 });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ origin: { id: '100', balance: 15 } });
    });
  });

  describe('transfer', () => {
    it('moves amount from origin to destination', async () => {
      await request(app).post('/event').send({ type: 'deposit', destination: '100', amount: 15 });

      const res = await request(app)
        .post('/event')
        .send({ type: 'transfer', origin: '100', destination: '300', amount: 15 });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        origin: { id: '100', balance: 0 },
        destination: { id: '300', balance: 15 },
      });
    });

    it('returns 404 when origin does not exist', async () => {
      const res = await request(app)
        .post('/event')
        .send({ type: 'transfer', origin: '200', destination: '300', amount: 15 });

      expect(res.status).toBe(404);
      expect(res.body).toBe(0);
    });
  });
});
