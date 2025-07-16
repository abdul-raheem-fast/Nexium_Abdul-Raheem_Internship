import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, query, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

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

    // Verify user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User account not found or deactivated'
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
};

// Validation middleware
const validateMoodEntry = [
  body('moodScore')
    .isInt({ min: 1, max: 10 })
    .withMessage('Mood score must be between 1 and 10'),
  body('moodType')
    .isIn(['TERRIBLE', 'BAD', 'OKAY', 'GOOD', 'GREAT', 'EXCITED', 'CALM', 'ANXIOUS', 'SAD', 'ANGRY', 'CONFUSED', 'GRATEFUL', 'HOPEFUL'])
    .withMessage('Invalid mood type'),
  body('energy')
    .isInt({ min: 1, max: 10 })
    .withMessage('Energy must be between 1 and 10'),
  body('anxiety')
    .isInt({ min: 1, max: 10 })
    .withMessage('Anxiety must be between 1 and 10'),
  body('stress')
    .isInt({ min: 1, max: 10 })
    .withMessage('Stress must be between 1 and 10'),
  body('sleep')
    .isInt({ min: 0, max: 24 })
    .withMessage('Sleep hours must be between 0 and 24'),
  body('activities')
    .optional()
    .isArray()
    .withMessage('Activities must be an array'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  body('physicalHealth')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Physical health must be between 1 and 10'),
  body('socialContext')
    .optional()
    .isIn(['alone', 'with_friends', 'with_family', 'work', 'public'])
    .withMessage('Invalid social context'),
  body('weather')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Weather description too long'),
  body('location')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Location description too long')
];

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array()
    });
  }
  next();
};

// MOOD ROUTES

/**
 * POST /api/moods
 * Create a new mood entry
 */
router.post('/', authenticateToken, validateMoodEntry, checkValidation, async (req, res) => {
  try {
    const {
      moodScore,
      moodType,
      energy,
      anxiety,
      stress,
      sleep,
      activities = [],
      tags = [],
      notes,
      physicalHealth,
      socialContext,
      weather,
      location,
      entryMethod = 'MANUAL'
    } = req.body;

    // Check if user already has a mood entry for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingEntry = await prisma.moodEntry.findFirst({
      where: {
        userId: req.userId,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    if (existingEntry) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'You have already logged your mood today. Use PUT to update it.',
        existingEntryId: existingEntry.id
      });
    }

    // Create mood entry
    const moodEntry = await prisma.moodEntry.create({
      data: {
        userId: req.userId,
        moodScore,
        moodType,
        energy,
        anxiety,
        stress,
        sleep,
        activities,
        tags,
        notes,
        physicalHealth,
        socialContext,
        weather,
        location,
        entryMethod,
        triggers: [] // Will be populated by AI analysis
      }
    });

    // Update user analytics for today
    const analyticsDate = new Date();
    analyticsDate.setHours(0, 0, 0, 0);

    await prisma.userAnalytics.upsert({
      where: {
        userId_date: {
          userId: req.userId,
          date: analyticsDate
        }
      },
      update: {
        avgMoodScore: moodScore,
        dominantMood: moodType,
        sleepHours: sleep,
        entriesCreated: {
          increment: 1
        }
      },
      create: {
        userId: req.userId,
        date: analyticsDate,
        avgMoodScore: moodScore,
        dominantMood: moodType,
        sleepHours: sleep,
        entriesCreated: 1
      }
    });

    // TODO: Trigger AI analysis in background
    // This would analyze sentiment, detect patterns, identify triggers, etc.

    res.status(201).json({
      message: 'Mood entry created successfully',
      moodEntry: {
        ...moodEntry,
        // Include computed fields if any
      }
    });

  } catch (error) {
    console.error('Create mood entry error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create mood entry'
    });
  }
});

/**
 * GET /api/moods
 * Get mood entries for the user with filtering and pagination
 */
router.get('/', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('from').optional().isISO8601().withMessage('From date must be valid ISO8601 date'),
  query('to').optional().isISO8601().withMessage('To date must be valid ISO8601 date'),
  query('moodType').optional().isIn(['TERRIBLE', 'BAD', 'OKAY', 'GOOD', 'GREAT', 'EXCITED', 'CALM', 'ANXIOUS', 'SAD', 'ANGRY', 'CONFUSED', 'GRATEFUL', 'HOPEFUL']).withMessage('Invalid mood type')
], checkValidation, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const from = req.query.from ? new Date(req.query.from) : null;
    const to = req.query.to ? new Date(req.query.to) : null;
    const moodType = req.query.moodType;

    // Build where clause
    const where = {
      userId: req.userId,
      ...(from && to && {
        createdAt: {
          gte: from,
          lte: to
        }
      }),
      ...(moodType && { moodType })
    };

    // Get total count
    const totalCount = await prisma.moodEntry.count({ where });

    // Get entries with pagination
    const moodEntries = await prisma.moodEntry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    // Calculate basic statistics
    const stats = await prisma.moodEntry.aggregate({
      where: { userId: req.userId },
      _avg: {
        moodScore: true,
        energy: true,
        anxiety: true,
        stress: true,
        sleep: true
      },
      _count: {
        id: true
      }
    });

    res.status(200).json({
      moodEntries,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrevious: page > 1
      },
      statistics: {
        totalEntries: stats._count.id,
        averages: {
          mood: Math.round((stats._avg.moodScore || 0) * 10) / 10,
          energy: Math.round((stats._avg.energy || 0) * 10) / 10,
          anxiety: Math.round((stats._avg.anxiety || 0) * 10) / 10,
          stress: Math.round((stats._avg.stress || 0) * 10) / 10,
          sleep: Math.round((stats._avg.sleep || 0) * 10) / 10
        }
      }
    });

  } catch (error) {
    console.error('Get mood entries error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve mood entries'
    });
  }
});

/**
 * GET /api/moods/:id
 * Get a specific mood entry
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const moodEntry = await prisma.moodEntry.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!moodEntry) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Mood entry not found'
      });
    }

    res.status(200).json({
      moodEntry
    });

  } catch (error) {
    console.error('Get mood entry error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve mood entry'
    });
  }
});

/**
 * PUT /api/moods/:id
 * Update a mood entry
 */
router.put('/:id', authenticateToken, validateMoodEntry, checkValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      moodScore,
      moodType,
      energy,
      anxiety,
      stress,
      sleep,
      activities = [],
      tags = [],
      notes,
      physicalHealth,
      socialContext,
      weather,
      location
    } = req.body;

    // Check if entry exists and belongs to user
    const existingEntry = await prisma.moodEntry.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!existingEntry) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Mood entry not found'
      });
    }

    // Update mood entry
    const updatedEntry = await prisma.moodEntry.update({
      where: { id },
      data: {
        moodScore,
        moodType,
        energy,
        anxiety,
        stress,
        sleep,
        activities,
        tags,
        notes,
        physicalHealth,
        socialContext,
        weather,
        location,
        updatedAt: new Date()
      }
    });

    // Update analytics if this is today's entry
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const entryDate = new Date(existingEntry.createdAt);
    entryDate.setHours(0, 0, 0, 0);

    if (entryDate.getTime() === today.getTime()) {
      await prisma.userAnalytics.update({
        where: {
          userId_date: {
            userId: req.userId,
            date: today
          }
        },
        data: {
          avgMoodScore: moodScore,
          dominantMood: moodType,
          sleepHours: sleep
        }
      });
    }

    res.status(200).json({
      message: 'Mood entry updated successfully',
      moodEntry: updatedEntry
    });

  } catch (error) {
    console.error('Update mood entry error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update mood entry'
    });
  }
});

/**
 * DELETE /api/moods/:id
 * Delete a mood entry
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if entry exists and belongs to user
    const existingEntry = await prisma.moodEntry.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!existingEntry) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Mood entry not found'
      });
    }

    // Delete mood entry
    await prisma.moodEntry.delete({
      where: { id }
    });

    res.status(200).json({
      message: 'Mood entry deleted successfully'
    });

  } catch (error) {
    console.error('Delete mood entry error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete mood entry'
    });
  }
});

/**
 * GET /api/moods/analytics/trends
 * Get mood trends and analytics
 */
router.get('/analytics/trends', authenticateToken, [
  query('period').optional().isIn(['week', 'month', 'quarter', 'year']).withMessage('Invalid period'),
  query('metric').optional().isIn(['mood', 'energy', 'anxiety', 'stress', 'sleep']).withMessage('Invalid metric')
], checkValidation, async (req, res) => {
  try {
    const period = req.query.period || 'month';
    const metric = req.query.metric || 'mood';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    // Get mood entries for the period
    const entries = await prisma.moodEntry.findMany({
      where: {
        userId: req.userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { createdAt: 'asc' },
      select: {
        moodScore: true,
        energy: true,
        anxiety: true,
        stress: true,
        sleep: true,
        moodType: true,
        createdAt: true
      }
    });

    // Group by day and calculate averages
    const groupedData = entries.reduce((acc, entry) => {
      const dateKey = entry.createdAt.toISOString().split('T')[0];
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          count: 0,
          moodSum: 0,
          energySum: 0,
          anxietySum: 0,
          stressSum: 0,
          sleepSum: 0,
          moods: []
        };
      }
      
      acc[dateKey].count++;
      acc[dateKey].moodSum += entry.moodScore;
      acc[dateKey].energySum += entry.energy;
      acc[dateKey].anxietySum += entry.anxiety;
      acc[dateKey].stressSum += entry.stress;
      acc[dateKey].sleepSum += entry.sleep;
      acc[dateKey].moods.push(entry.moodType);
      
      return acc;
    }, {});

    // Calculate daily averages
    const trendData = Object.values(groupedData).map(day => ({
      date: day.date,
      mood: Math.round((day.moodSum / day.count) * 10) / 10,
      energy: Math.round((day.energySum / day.count) * 10) / 10,
      anxiety: Math.round((day.anxietySum / day.count) * 10) / 10,
      stress: Math.round((day.stressSum / day.count) * 10) / 10,
      sleep: Math.round((day.sleepSum / day.count) * 10) / 10,
      dominantMood: day.moods.sort((a, b) => 
        day.moods.filter(v => v === a).length - day.moods.filter(v => v === b).length
      ).pop()
    }));

    // Calculate overall statistics
    const overallStats = entries.length > 0 ? {
      averageMood: Math.round((entries.reduce((sum, e) => sum + e.moodScore, 0) / entries.length) * 10) / 10,
      averageEnergy: Math.round((entries.reduce((sum, e) => sum + e.energy, 0) / entries.length) * 10) / 10,
      averageAnxiety: Math.round((entries.reduce((sum, e) => sum + e.anxiety, 0) / entries.length) * 10) / 10,
      averageStress: Math.round((entries.reduce((sum, e) => sum + e.stress, 0) / entries.length) * 10) / 10,
      averageSleep: Math.round((entries.reduce((sum, e) => sum + e.sleep, 0) / entries.length) * 10) / 10,
      totalEntries: entries.length
    } : null;

    res.status(200).json({
      period,
      metric,
      trendData,
      statistics: overallStats,
      dateRange: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('Get mood trends error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve mood trends'
    });
  }
});

/**
 * GET /api/moods/today
 * Get today's mood entry
 */
router.get('/today', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayEntry = await prisma.moodEntry.findFirst({
      where: {
        userId: req.userId,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    res.status(200).json({
      hasEntry: !!todayEntry,
      moodEntry: todayEntry || null
    });

  } catch (error) {
    console.error('Get today mood error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve today\'s mood entry'
    });
  }
});

export default router; 