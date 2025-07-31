import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Initialize Prisma with error handling for development
let prisma = null;

const initializePrisma = async () => {
  // Only use demo mode if explicitly set to true
  if (process.env.DEMO_MODE === 'true') {
    console.log('🎯 Demo mode: Using in-memory storage instead of Prisma database');
    return null;
  }
  
  if (!process.env.DATABASE_URL) {
    console.log('⚠️ DATABASE_URL not provided - using development mode without database');
    return null;
  }
  
  try {
    const client = new PrismaClient();
    // Test the connection
    await client.$connect();
    console.log('✅ Prisma connected successfully');
    return client;
  } catch (error) {
    console.log('⚠️ Prisma connection failed - using development mode without database:', error.message);
    return null;
  }
};

// Initialize Prisma asynchronously
(async () => {
  if (process.env.DATABASE_URL) {
    prisma = await initializePrisma();
  }
})();

// In-memory storage for development
const devUsers = new Map();

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No token provided'
    });
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'access') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token type'
      });
    }

    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
};

// Validation middleware
const validateSettings = [
  body('emailNotifications').optional().isBoolean(),
  body('pushNotifications').optional().isBoolean(),
  body('reminderFrequency').optional().isIn(['DAILY', 'WEEKLY', 'MONTHLY']),
  body('moodTrackingEnabled').optional().isBoolean(),
  body('dailyCheckIns').optional().isBoolean(),
  body('weeklyReports').optional().isBoolean(),
  body('dataRetentionDays').optional().isInt({ min: 30, max: 3650 }),
  body('aiInsightsEnabled').optional().isBoolean(),
  body('personalizedTips').optional().isBoolean(),
  body('trendAnalysis').optional().isBoolean(),
  body('crisisMode').optional().isBoolean(),
  body('emergencyContacts').optional().isBoolean()
];

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input data',
      details: errors.array()
    });
  }
  next();
};

// Example route
router.get('/', (req, res) => {
  res.json({ message: 'User route is working.' });
});

/**
 * PATCH /api/users/settings
 * Update user settings
 */
router.patch('/settings', authenticateToken, validateSettings, checkValidation, async (req, res) => {
  try {
    const updates = req.body;
    
    if (!prisma) {
      // Development mode - simulate success
      console.log('🔧 Development mode: Simulating settings update for user:', req.userEmail);
      console.log('Settings updates:', updates);
      
      return res.status(200).json({
        message: 'Settings updated successfully (development mode)',
        settings: {
          ...updates,
          updatedAt: new Date()
        }
      });
    }
    
    // Production mode - update database
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        include: { settings: true }
      });

      if (!user) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'User not found'
        });
      }

      // Update settings
      const updatedSettings = await prisma.userSettings.upsert({
        where: { userId: req.userId },
        update: {
          ...updates,
          updatedAt: new Date()
        },
        create: {
          userId: req.userId,
          ...updates
        }
      });

      res.status(200).json({
        message: 'Settings updated successfully',
        settings: updatedSettings
      });

    } catch (dbError) {
      console.error('❌ Database error:', dbError.message);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Unable to update settings. Please try again later.'
      });
    }

  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update settings'
    });
  }
});

/**
 * GET /api/users/settings
 * Get user settings
 */
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    if (!prisma) {
      // Development mode - return mock settings
      console.log('🔧 Development mode: Returning mock settings for user:', req.userEmail);
      
      return res.status(200).json({
        settings: {
          emailNotifications: true,
          pushNotifications: true,
          reminderFrequency: 'DAILY',
          moodTrackingEnabled: true,
          dailyCheckIns: true,
          weeklyReports: true,
          dataRetentionDays: 365,
          aiInsightsEnabled: true,
          personalizedTips: true,
          trendAnalysis: true,
          crisisMode: false,
          emergencyContacts: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }
    
    // Production mode - get from database
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        include: { settings: true }
      });

      if (!user) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'User not found'
        });
      }

      res.status(200).json({
        settings: user.settings || {}
      });

    } catch (dbError) {
      console.error('❌ Database error:', dbError.message);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Unable to get settings. Please try again later.'
      });
    }

  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get settings'
    });
  }
});

export default router; 