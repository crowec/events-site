import sqlite3 from 'sqlite3';

export interface RSVP {
  id: number;
  eventId: string;
  guestName: string;
  status: 'yes' | 'no' | 'maybe';
  createdAt: string;
}

export interface RSVPCounts {
  yes: number;
  no: number;
  maybe: number;
  total: number;
}

class DatabaseService {
  private db: sqlite3.Database;
  private isInitialized: boolean = false;

  constructor(dbPath?: string) {
    const defaultPath = dbPath || '/tmp/rsvps.db';
    
    this.db = new sqlite3.Database(defaultPath);
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    const createTable = `
      CREATE TABLE IF NOT EXISTS rsvps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        eventId TEXT NOT NULL,
        guestName TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('yes', 'no', 'maybe')),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(eventId, guestName)
      )
    `;

    this.db.run(createTable, (err) => {
      if (err) {
        console.error('Database initialization failed:', err);
        throw err;
      } else {
        console.log('Database initialized successfully');
        this.isInitialized = true;
      }
    });
  }

  async waitForInitialization(): Promise<void> {
    return new Promise((resolve) => {
      const checkInit = () => {
        if (this.isInitialized) {
          resolve();
        } else {
          setTimeout(checkInit, 10);
        }
      };
      checkInit();
    });
  }

  async submitRSVP(eventId: string, guestName: string, status: 'yes' | 'no' | 'maybe'): Promise<void> {
    await this.waitForInitialization();
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT OR REPLACE INTO rsvps (eventId, guestName, status, createdAt)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `;
      
      this.db.run(query, [eventId, guestName, status], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async getRSVPsForEvent(eventId: string): Promise<RSVP[]> {
    await this.waitForInitialization();
    
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM rsvps WHERE eventId = ? ORDER BY createdAt DESC';
      
      this.db.all(query, [eventId], (err, rows: RSVP[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  async getRSVPCounts(eventId: string): Promise<RSVPCounts> {
    await this.waitForInitialization();
    
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          status,
          COUNT(*) as count
        FROM rsvps 
        WHERE eventId = ? 
        GROUP BY status
      `;
      
      this.db.all(query, [eventId], (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const counts: RSVPCounts = { yes: 0, no: 0, maybe: 0, total: 0 };
          
          rows.forEach(row => {
            counts[row.status as keyof Omit<RSVPCounts, 'total'>] = row.count;
            counts.total += row.count;
          });
          
          resolve(counts);
        }
      });
    });
  }

  async clearAll(): Promise<void> {
    await this.waitForInitialization();
    
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM rsvps', [], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  close(): void {
    this.db.close();
  }
}

export { DatabaseService };