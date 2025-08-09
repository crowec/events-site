import request from 'supertest';
import express from 'express';
import rsvpRoutes from '../routes/rsvp';

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/rsvp', rsvpRoutes);
  return app;
};

describe('RSVP Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('POST /api/rsvp', () => {
    test('should submit RSVP successfully with valid data', async () => {
      const rsvpData = {
        eventId: 'test-event-1',
        guestName: 'John Doe',
        status: 'yes'
      };

      const response = await request(app)
        .post('/api/rsvp')
        .send(rsvpData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('RSVP submitted successfully');
      expect(response.body.counts).toBeDefined();
      expect(response.body.counts.total).toBe(1);
      expect(response.body.counts.yes).toBe(1);
    });

    test('should return validation error for missing eventId', async () => {
      const rsvpData = {
        guestName: 'John Doe',
        status: 'yes'
      };

      const response = await request(app)
        .post('/api/rsvp')
        .send(rsvpData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toBeDefined();
    });

    test('should return validation error for missing guestName', async () => {
      const rsvpData = {
        eventId: 'test-event-1',
        status: 'yes'
      };

      const response = await request(app)
        .post('/api/rsvp')
        .send(rsvpData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });

    test('should return validation error for invalid status', async () => {
      const rsvpData = {
        eventId: 'test-event-1',
        guestName: 'John Doe',
        status: 'invalid'
      };

      const response = await request(app)
        .post('/api/rsvp')
        .send(rsvpData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });

    test('should handle empty guestName', async () => {
      const rsvpData = {
        eventId: 'test-event-1',
        guestName: '',
        status: 'yes'
      };

      const response = await request(app)
        .post('/api/rsvp')
        .send(rsvpData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });

    test('should handle very long guestName', async () => {
      const rsvpData = {
        eventId: 'test-event-1',
        guestName: 'A'.repeat(101), // 101 characters, over the limit
        status: 'yes'
      };

      const response = await request(app)
        .post('/api/rsvp')
        .send(rsvpData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });

    test('should update existing RSVP when guest submits again', async () => {
      const eventId = 'test-event-update';
      const guestName = 'Jane Doe';

      // Submit initial RSVP
      await request(app)
        .post('/api/rsvp')
        .send({ eventId, guestName, status: 'yes' })
        .expect(200);

      // Update the same guest's RSVP
      const response = await request(app)
        .post('/api/rsvp')
        .send({ eventId, guestName, status: 'no' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.counts.total).toBe(1);
      expect(response.body.counts.yes).toBe(0);
      expect(response.body.counts.no).toBe(1);
    });
  });

  describe('GET /api/rsvp/:eventId', () => {
    test('should return empty RSVPs for event with no responses', async () => {
      const response = await request(app)
        .get('/api/rsvp/empty-event')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.rsvps).toEqual([]);
      expect(response.body.counts).toEqual({
        yes: 0,
        no: 0,
        maybe: 0,
        total: 0
      });
    });

    test('should return RSVPs for event with responses', async () => {
      const eventId = 'test-event-with-rsvps';
      
      // Submit some RSVPs first
      await request(app)
        .post('/api/rsvp')
        .send({ eventId, guestName: 'Guest 1', status: 'yes' });
      
      await request(app)
        .post('/api/rsvp')
        .send({ eventId, guestName: 'Guest 2', status: 'maybe' });

      const response = await request(app)
        .get(`/api/rsvp/${eventId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.rsvps).toHaveLength(2);
      expect(response.body.counts.total).toBe(2);
      expect(response.body.counts.yes).toBe(1);
      expect(response.body.counts.maybe).toBe(1);

      // Check RSVP structure
      const rsvp = response.body.rsvps[0];
      expect(rsvp).toHaveProperty('id');
      expect(rsvp).toHaveProperty('eventId', eventId);
      expect(rsvp).toHaveProperty('guestName');
      expect(rsvp).toHaveProperty('status');
      expect(rsvp).toHaveProperty('createdAt');
    });

    test('should return only RSVPs for specified event', async () => {
      const event1Id = 'event-1-isolation';
      const event2Id = 'event-2-isolation';
      
      // Submit RSVPs to both events
      await request(app)
        .post('/api/rsvp')
        .send({ eventId: event1Id, guestName: 'Guest A', status: 'yes' });
      
      await request(app)
        .post('/api/rsvp')
        .send({ eventId: event2Id, guestName: 'Guest B', status: 'no' });

      // Get RSVPs for event 1 only
      const response = await request(app)
        .get(`/api/rsvp/${event1Id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.rsvps).toHaveLength(1);
      expect(response.body.rsvps[0].guestName).toBe('Guest A');
      expect(response.body.rsvps[0].eventId).toBe(event1Id);
    });

    test('should handle missing eventId parameter', async () => {
      await request(app)
        .get('/api/rsvp/')
        .expect(404); // Express returns 404 for missing route parameters
    });
  });

  describe('Integration Tests', () => {
    test('should handle complete RSVP workflow', async () => {
      const eventId = 'integration-test-event';
      
      // 1. Initially no RSVPs
      let response = await request(app)
        .get(`/api/rsvp/${eventId}`)
        .expect(200);
      
      expect(response.body.rsvps).toHaveLength(0);
      expect(response.body.counts.total).toBe(0);

      // 2. Submit first RSVP
      await request(app)
        .post('/api/rsvp')
        .send({ eventId, guestName: 'Alice', status: 'yes' })
        .expect(200);

      // 3. Submit second RSVP
      await request(app)
        .post('/api/rsvp')
        .send({ eventId, guestName: 'Bob', status: 'maybe' })
        .expect(200);

      // 4. Submit third RSVP  
      await request(app)
        .post('/api/rsvp')
        .send({ eventId, guestName: 'Charlie', status: 'no' })
        .expect(200);

      // 5. Check final state
      response = await request(app)
        .get(`/api/rsvp/${eventId}`)
        .expect(200);

      expect(response.body.rsvps).toHaveLength(3);
      expect(response.body.counts.total).toBe(3);
      expect(response.body.counts.yes).toBe(1);
      expect(response.body.counts.no).toBe(1);
      expect(response.body.counts.maybe).toBe(1);

      // 6. Update existing RSVP
      await request(app)
        .post('/api/rsvp')
        .send({ eventId, guestName: 'Alice', status: 'no' })
        .expect(200);

      // 7. Check updated state
      response = await request(app)
        .get(`/api/rsvp/${eventId}`)
        .expect(200);

      expect(response.body.rsvps).toHaveLength(3); // Still 3 guests
      expect(response.body.counts.total).toBe(3);
      expect(response.body.counts.yes).toBe(0); // Alice changed from yes to no
      expect(response.body.counts.no).toBe(2); // Now Alice and Charlie
      expect(response.body.counts.maybe).toBe(1); // Still Bob
    });
  });
});