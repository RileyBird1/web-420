const request = require('supertest');
const app = require('../src/app');

describe('Chapter 3.1: API Tests', () => {
  test('Should return an array of books', async() => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('title');
  });

  test('Should return a single book', async() => {
    const res = await request(app).get('/api/books/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('title');
  });

  test('Should return a 400 error if the id is not a number', async() => {
    const res = await request(app).get('/api/books/abc');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/id must be a number/i);
  });
});

describe('Chapter 4.1:API Tests', () => {
  test('Should return a 201-status code for add', async() => {
    const res = (await request(app).post('/api/books').send({title: "Les Miserable", author: "Victor Hugo"}));
    expect(res.statusCode).toBe(201);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('title');
  });

  test('Should return a 400-status code for add without title', async() => {
    const res = (await request(app).post('/api/books').send({title: "", author: "Victor Hugo"}));
    expect(res.statusCode).toBe(400);
  });

  test('Should return a 204-status code for delete', async() => {
    const res = (await request(app).delete('/api/books/1'));
    expect(res.statusCode).toBe(204);
  });
});