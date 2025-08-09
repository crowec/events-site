import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { DatabaseService } from '../services/database';

const router = Router();

// Create database instance
const database = new DatabaseService();

// Validation middleware
const rsvpValidation = [
  body('eventId').isString().trim().isLength({ min: 1 }).withMessage('Event ID is required'),
  body('guestName').isString().trim().isLength({ min: 1, max: 100 }).withMessage('Guest name is required and must be 1-100 characters'),
  body('status').isIn(['yes', 'no', 'maybe']).withMessage('Status must be yes, no, or maybe')
];

// POST /api/rsvp - Submit an RSVP
router.post('/', rsvpValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: errors.array() 
      });
      return;
    }

    const { eventId, guestName, status } = req.body;
    
    await database.submitRSVP(eventId, guestName.trim(), status);
    const counts = await database.getRSVPCounts(eventId);

    res.json({
      success: true,
      message: 'RSVP submitted successfully',
      counts
    });
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// GET /api/rsvp/:eventId - Get RSVPs for an event
router.get('/:eventId', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    
    if (!eventId || typeof eventId !== 'string') {
      res.status(400).json({ 
        success: false, 
        error: 'Event ID is required' 
      });
      return;
    }

    const [rsvps, counts] = await Promise.all([
      database.getRSVPsForEvent(eventId),
      database.getRSVPCounts(eventId)
    ]);

    res.json({
      success: true,
      rsvps,
      counts
    });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

export default router;