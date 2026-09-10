import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import { pool } from '../db/connection';

describe('Server REST API Integration Suite', () => {
  afterAll(async () => {
    await pool.end();
  });
  describe('GET /api/health', () => {
    it('should return 200 OK and health payload', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('service');
    });
  });

  describe('GET /api/config', () => {
    it('should return wedding configuration with groom and bride details', async () => {
      const res = await request(app).get('/api/config');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('groom');
      expect(res.body).toHaveProperty('bride');
      expect(res.body).toHaveProperty('events');
    });
  });

  describe('POST /api/wishes Validation', () => {
    it('should reject wish submission with missing name or message', async () => {
      const res = await request(app)
        .post('/api/wishes')
        .send({ name: '', text: '' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/rsvps Upsert & Validation', () => {
    it('should reject RSVP submission with missing guest name', async () => {
      const res = await request(app)
        .post('/api/rsvps')
        .send({ name: '', attendance: 'hadir', guestCount: 1 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should upsert RSVP when guest re-submits with same name to prevent duplicates', async () => {
      const testName = 'Test Guest Vitest ' + Date.now();
      const firstRes = await request(app)
        .post('/api/rsvps')
        .send({ name: testName, attendance: 'tidak_hadir', guestCount: 1, notes: 'Awalnya tidak bisa' });

      expect(firstRes.status).toBe(201);
      expect(firstRes.body.isUpdate).toBe(false);

      const secondRes = await request(app)
        .post('/api/rsvps')
        .send({ name: testName, attendance: 'hadir', guestCount: 2, notes: 'Bisa hadir berdua' });

      expect(secondRes.status).toBe(200);
      expect(secondRes.body.isUpdate).toBe(true);
      expect(secondRes.body.data.guestCount).toBe(2);
      expect(secondRes.body.data.attendance).toBe('hadir');

      // Cleanup database
      if (firstRes.body.data?.id) {
        await pool.query('DELETE FROM rsvps WHERE id = ?', [firstRes.body.data.id]);
      }
    });
  });

  describe('GET /api/trivia Security Invariant', () => {
    it('should censor correct_index and explanation on public endpoint', async () => {
      const res = await request(app).get('/api/trivia');
      expect(res.status).toBe(200);
      if (Array.isArray(res.body) && res.body.length > 0) {
        const firstQuestion = res.body[0];
        expect(firstQuestion).not.toHaveProperty('correct_index');
        expect(firstQuestion).not.toHaveProperty('explanation');
        expect(firstQuestion).toHaveProperty('question');
        expect(firstQuestion).toHaveProperty('options');
      }
    });
  });

  describe('Admin Guardrails on /api/checkins', () => {
    it('should reject unauthenticated requests to GET /api/checkins with 401', async () => {
      const res = await request(app).get('/api/checkins');
      expect(res.status).toBe(401);
    });

    it('should reject unauthenticated requests to POST /api/checkins/sync with 401', async () => {
      const res = await request(app)
        .post('/api/checkins/sync')
        .send({ items: [] });
      expect(res.status).toBe(401);
    });
  });
});
