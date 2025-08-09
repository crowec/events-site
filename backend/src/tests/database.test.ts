import { DatabaseService } from '../services/database';
import path from 'path';
import fs from 'fs';

describe('DatabaseService', () => {
  let database: DatabaseService;
  let testDbPath: string;

  beforeEach(async () => {
    // Create a unique test database for each test
    const testDir = path.join(__dirname, '../../test-data');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    testDbPath = path.join(testDir, `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.db`);
    database = new DatabaseService(testDbPath);
    await database.waitForInitialization();
  });

  afterEach(async () => {
    database.close();
    // Clean up test database
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  describe('initialization', () => {
    test('should initialize database successfully', async () => {
      expect(database).toBeDefined();
      // Test that we can perform operations (which means DB is ready)
      await expect(database.getRSVPsForEvent('test-event')).resolves.toEqual([]);
    });
  });

  describe('submitRSVP', () => {
    test('should submit a new RSVP successfully', async () => {
      await database.submitRSVP('event1', 'John Doe', 'yes');
      
      const rsvps = await database.getRSVPsForEvent('event1');
      expect(rsvps).toHaveLength(1);
      expect(rsvps[0].eventId).toBe('event1');
      expect(rsvps[0].guestName).toBe('John Doe');
      expect(rsvps[0].status).toBe('yes');
    });

    test('should update existing RSVP when guest submits again', async () => {
      // Submit initial RSVP
      await database.submitRSVP('event1', 'John Doe', 'yes');
      
      // Update the same guest's RSVP
      await database.submitRSVP('event1', 'John Doe', 'no');
      
      const rsvps = await database.getRSVPsForEvent('event1');
      expect(rsvps).toHaveLength(1);
      expect(rsvps[0].status).toBe('no');
    });

    test('should handle multiple guests for same event', async () => {
      await database.submitRSVP('event1', 'John Doe', 'yes');
      await database.submitRSVP('event1', 'Jane Smith', 'maybe');
      await database.submitRSVP('event1', 'Bob Wilson', 'no');
      
      const rsvps = await database.getRSVPsForEvent('event1');
      expect(rsvps).toHaveLength(3);
      
      const names = rsvps.map(r => r.guestName);
      expect(names).toContain('John Doe');
      expect(names).toContain('Jane Smith');
      expect(names).toContain('Bob Wilson');
    });

    test('should handle same guest across different events', async () => {
      await database.submitRSVP('event1', 'John Doe', 'yes');
      await database.submitRSVP('event2', 'John Doe', 'no');
      
      const event1RSVPs = await database.getRSVPsForEvent('event1');
      const event2RSVPs = await database.getRSVPsForEvent('event2');
      
      expect(event1RSVPs).toHaveLength(1);
      expect(event2RSVPs).toHaveLength(1);
      expect(event1RSVPs[0].status).toBe('yes');
      expect(event2RSVPs[0].status).toBe('no');
    });
  });

  describe('getRSVPsForEvent', () => {
    test('should return empty array for event with no RSVPs', async () => {
      const rsvps = await database.getRSVPsForEvent('nonexistent-event');
      expect(rsvps).toEqual([]);
    });

    test('should return RSVPs sorted by creation date (newest first)', async () => {
      await database.submitRSVP('event1', 'First Guest', 'yes');
      await new Promise(resolve => setTimeout(resolve, 500)); // Longer delay
      await database.submitRSVP('event1', 'Second Guest', 'no');
      await new Promise(resolve => setTimeout(resolve, 500)); // Longer delay
      await database.submitRSVP('event1', 'Third Guest', 'maybe');
      
      const rsvps = await database.getRSVPsForEvent('event1');
      expect(rsvps).toHaveLength(3);
      
      // Just check that they are sorted by timestamp (newest first)
      const timestamps = rsvps.map(r => new Date(r.createdAt).getTime());
      expect(timestamps[0]).toBeGreaterThanOrEqual(timestamps[1]);
      expect(timestamps[1]).toBeGreaterThanOrEqual(timestamps[2]);
    });

    test('should only return RSVPs for specified event', async () => {
      await database.submitRSVP('event1', 'John Doe', 'yes');
      await database.submitRSVP('event2', 'Jane Smith', 'no');
      
      const event1RSVPs = await database.getRSVPsForEvent('event1');
      expect(event1RSVPs).toHaveLength(1);
      expect(event1RSVPs[0].guestName).toBe('John Doe');
    });
  });

  describe('getRSVPCounts', () => {
    test('should return zero counts for event with no RSVPs', async () => {
      const counts = await database.getRSVPCounts('empty-event');
      expect(counts).toEqual({
        yes: 0,
        no: 0,
        maybe: 0,
        total: 0
      });
    });

    test('should return correct counts for mixed responses', async () => {
      await database.submitRSVP('event1', 'Guest1', 'yes');
      await database.submitRSVP('event1', 'Guest2', 'yes');
      await database.submitRSVP('event1', 'Guest3', 'no');
      await database.submitRSVP('event1', 'Guest4', 'maybe');
      await database.submitRSVP('event1', 'Guest5', 'maybe');
      await database.submitRSVP('event1', 'Guest6', 'maybe');
      
      const counts = await database.getRSVPCounts('event1');
      expect(counts.yes).toBe(2);
      expect(counts.no).toBe(1);
      expect(counts.maybe).toBe(3);
      expect(counts.total).toBe(6);
    });

    test('should update counts when guest changes RSVP', async () => {
      await database.submitRSVP('event1', 'Guest1', 'yes');
      await database.submitRSVP('event1', 'Guest2', 'yes');
      
      let counts = await database.getRSVPCounts('event1');
      expect(counts.yes).toBe(2);
      expect(counts.total).toBe(2);
      
      // Guest1 changes to 'no'
      await database.submitRSVP('event1', 'Guest1', 'no');
      
      counts = await database.getRSVPCounts('event1');
      expect(counts.yes).toBe(1);
      expect(counts.no).toBe(1);
      expect(counts.total).toBe(2);
    });

    test('should only count RSVPs for specified event', async () => {
      await database.submitRSVP('event1', 'Guest1', 'yes');
      await database.submitRSVP('event2', 'Guest2', 'yes');
      await database.submitRSVP('event2', 'Guest3', 'no');
      
      const event1Counts = await database.getRSVPCounts('event1');
      const event2Counts = await database.getRSVPCounts('event2');
      
      expect(event1Counts.total).toBe(1);
      expect(event2Counts.total).toBe(2);
    });
  });

  describe('clearAll', () => {
    test('should remove all RSVPs from database', async () => {
      await database.submitRSVP('event1', 'Guest1', 'yes');
      await database.submitRSVP('event2', 'Guest2', 'no');
      
      let allRSVPs = await database.getRSVPsForEvent('event1');
      expect(allRSVPs).toHaveLength(1);
      
      await database.clearAll();
      
      const event1RSVPs = await database.getRSVPsForEvent('event1');
      const event2RSVPs = await database.getRSVPsForEvent('event2');
      
      expect(event1RSVPs).toHaveLength(0);
      expect(event2RSVPs).toHaveLength(0);
    });
  });

  describe('data integrity', () => {
    test('should have required RSVP properties', async () => {
      await database.submitRSVP('event1', 'Test Guest', 'yes');
      
      const rsvps = await database.getRSVPsForEvent('event1');
      const rsvp = rsvps[0];
      
      expect(rsvp).toHaveProperty('id');
      expect(rsvp).toHaveProperty('eventId', 'event1');
      expect(rsvp).toHaveProperty('guestName', 'Test Guest');
      expect(rsvp).toHaveProperty('status', 'yes');
      expect(rsvp).toHaveProperty('createdAt');
      
      expect(typeof rsvp.id).toBe('number');
      expect(typeof rsvp.eventId).toBe('string');
      expect(typeof rsvp.guestName).toBe('string');
      expect(['yes', 'no', 'maybe']).toContain(rsvp.status);
      expect(typeof rsvp.createdAt).toBe('string');
    });

    test('should reject invalid status values', async () => {
      // This should be caught by TypeScript, but let's test runtime behavior
      await expect(
        database.submitRSVP('event1', 'Guest', 'invalid' as any)
      ).rejects.toThrow();
    });
  });
});