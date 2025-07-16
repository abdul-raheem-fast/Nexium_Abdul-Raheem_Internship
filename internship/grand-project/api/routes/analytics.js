import express from 'express';
import { PrismaClient } from '@prisma/client';
import { query, validationResult } from 'express-validator';
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

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { settings: true }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User account not found or deactivated'
      });
    }

    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
};

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

// Helper function to calculate date ranges
const getDateRange = (period) => {
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
    default:
      startDate.setMonth(startDate.getMonth() - 1);
  }
  
  return { startDate, endDate };
};

// ANALYTICS ROUTES

/**
 * GET /api/analytics/dashboard
 * Get dashboard overview analytics
 */
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Parallel queries for better performance
    const [
      totalMoodEntries,
      recentMoodEntries,
      weeklyMoodEntries,
      totalGoals,
      completedGoals,
      activeGoals,
      totalActivities,
      recentActivities,
      currentStreak,
      achievements,
      todayAnalytics
    ] = await Promise.all([
      // Total mood entries
      prisma.moodEntry.count({
        where: { userId }
      }),
      
      // Recent mood entries (last 30 days)
      prisma.moodEntry.findMany({
        where: {
          userId,
          createdAt: { gte: thirtyDaysAgo }
        },
        orderBy: { createdAt: 'desc' },
        select: {
          moodScore: true,
          energy: true,
          stress: true,
          anxiety: true,
          sleep: true,
          createdAt: true
        }
      }),
      
      // Weekly mood entries
      prisma.moodEntry.findMany({
        where: {
          userId,
          createdAt: { gte: sevenDaysAgo }
        },
        select: {
          moodScore: true,
          createdAt: true
        }
      }),
      
      // Total goals
      prisma.goal.count({
        where: { userId }
      }),
      
      // Completed goals
      prisma.goal.count({
        where: {
          userId,
          status: 'COMPLETED'
        }
      }),
      
      // Active goals
      prisma.goal.findMany({
        where: {
          userId,
          status: 'ACTIVE'
        },
        select: {
          id: true,
          title: true,
          progress: true,
          targetValue: true,
          currentValue: true
        }
      }),
      
      // Total activities
      prisma.activity.count({
        where: { userId }
      }),
      
      // Recent activities
      prisma.activity.count({
        where: {
          userId,
          createdAt: { gte: sevenDaysAgo }
        }
      }),
      
      // Calculate current streak (consecutive days with mood entries)
      prisma.moodEntry.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
        take: 30
      }),
      
      // Unlocked achievements
      prisma.achievement.count({
        where: {
          userId,
          isUnlocked: true
        }
      }),
      
      // Today's analytics
      prisma.userAnalytics.findUnique({
        where: {
          userId_date: {
            userId,
            date: today
          }
        }
      })
    ]);

    // Calculate current streak
    let streak = 0;
    const today_check = new Date();
    today_check.setHours(0, 0, 0, 0);
    
    for (const entry of currentStreak) {
      const entryDate = new Date(entry.createdAt);
      entryDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today_check);
      expectedDate.setDate(expectedDate.getDate() - streak);
      
      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    // Calculate averages for recent entries
    const recentAverages = recentMoodEntries.length > 0 ? {
      mood: Math.round((recentMoodEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / recentMoodEntries.length) * 10) / 10,
      energy: Math.round((recentMoodEntries.reduce((sum, entry) => sum + entry.energy, 0) / recentMoodEntries.length) * 10) / 10,
      stress: Math.round((recentMoodEntries.reduce((sum, entry) => sum + entry.stress, 0) / recentMoodEntries.length) * 10) / 10,
      anxiety: Math.round((recentMoodEntries.reduce((sum, entry) => sum + entry.anxiety, 0) / recentMoodEntries.length) * 10) / 10,
      sleep: Math.round((recentMoodEntries.reduce((sum, entry) => sum + entry.sleep, 0) / recentMoodEntries.length) * 10) / 10
    } : null;

    // Calculate weekly trend
    const weeklyTrend = weeklyMoodEntries.length > 0 ? {
      average: Math.round((weeklyMoodEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / weeklyMoodEntries.length) * 10) / 10,
      change: weeklyMoodEntries.length > 1 ? 
        weeklyMoodEntries[0].moodScore - weeklyMoodEntries[weeklyMoodEntries.length - 1].moodScore : 0
    } : null;

    res.status(200).json({
      overview: {
        totalMoodEntries,
        totalGoals,
        completedGoals,
        totalActivities,
        currentStreak: streak,
        achievementsUnlocked: achievements
      },
      recentActivity: {
        moodEntriesLast30Days: recentMoodEntries.length,
        activitiesLast7Days: recentActivities,
        averages: recentAverages
      },
      weeklyTrend,
      activeGoals: activeGoals.map(goal => ({
        ...goal,
        progressPercentage: Math.round((goal.currentValue / goal.targetValue) * 100)
      })),
      todayStats: todayAnalytics ? {
        wellnessScore: todayAnalytics.wellnessScore,
        appUsageMinutes: todayAnalytics.appUsageMinutes,
        entriesCreated: todayAnalytics.entriesCreated
      } : null
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve dashboard analytics'
    });
  }
});

/**
 * GET /api/analytics/mood-trends
 * Get detailed mood trends and patterns
 */
router.get('/mood-trends', authenticateToken, [
  query('period').optional().isIn(['week', 'month', 'quarter', 'year']).withMessage('Invalid period'),
  query('groupBy').optional().isIn(['day', 'week', 'month']).withMessage('Invalid groupBy value')
], checkValidation, async (req, res) => {
  try {
    const period = req.query.period || 'month';
    const groupBy = req.query.groupBy || 'day';
    const { startDate, endDate } = getDateRange(period);

    // Get mood entries for the period
    const moodEntries = await prisma.moodEntry.findMany({
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
        moodType: true,
        energy: true,
        anxiety: true,
        stress: true,
        sleep: true,
        createdAt: true
      }
    });

    // Group data by time period
    const groupedData = {};
    moodEntries.forEach(entry => {
      let key;
      const date = new Date(entry.createdAt);
      
      switch (groupBy) {
        case 'day':
          key = date.toISOString().split('T')[0];
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
      }
      
      if (!groupedData[key]) {
        groupedData[key] = {
          period: key,
          entries: [],
          moodSum: 0,
          energySum: 0,
          anxietySum: 0,
          stressSum: 0,
          sleepSum: 0,
          count: 0
        };
      }
      
      groupedData[key].entries.push(entry);
      groupedData[key].moodSum += entry.moodScore;
      groupedData[key].energySum += entry.energy;
      groupedData[key].anxietySum += entry.anxiety;
      groupedData[key].stressSum += entry.stress;
      groupedData[key].sleepSum += entry.sleep;
      groupedData[key].count++;
    });

    // Calculate averages and trends
    const trendData = Object.values(groupedData).map(group => ({
      period: group.period,
      averages: {
        mood: Math.round((group.moodSum / group.count) * 10) / 10,
        energy: Math.round((group.energySum / group.count) * 10) / 10,
        anxiety: Math.round((group.anxietySum / group.count) * 10) / 10,
        stress: Math.round((group.stressSum / group.count) * 10) / 10,
        sleep: Math.round((group.sleepSum / group.count) * 10) / 10
      },
      entryCount: group.count,
      moodTypes: group.entries.map(e => e.moodType)
    }));

    // Calculate overall statistics
    const overallStats = moodEntries.length > 0 ? {
      totalEntries: moodEntries.length,
      averages: {
        mood: Math.round((moodEntries.reduce((sum, e) => sum + e.moodScore, 0) / moodEntries.length) * 10) / 10,
        energy: Math.round((moodEntries.reduce((sum, e) => sum + e.energy, 0) / moodEntries.length) * 10) / 10,
        anxiety: Math.round((moodEntries.reduce((sum, e) => sum + e.anxiety, 0) / moodEntries.length) * 10) / 10,
        stress: Math.round((moodEntries.reduce((sum, e) => sum + e.stress, 0) / moodEntries.length) * 10) / 10,
        sleep: Math.round((moodEntries.reduce((sum, e) => sum + e.sleep, 0) / moodEntries.length) * 10) / 10
      },
      moodDistribution: moodEntries.reduce((acc, entry) => {
        acc[entry.moodType] = (acc[entry.moodType] || 0) + 1;
        return acc;
      }, {})
    } : null;

    res.status(200).json({
      period,
      groupBy,
      dateRange: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      },
      trendData,
      statistics: overallStats
    });

  } catch (error) {
    console.error('Mood trends analytics error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve mood trends'
    });
  }
});

/**
 * GET /api/analytics/correlations
 * Get correlations between activities, sleep, and mood
 */
router.get('/correlations', authenticateToken, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get mood entries with activities
    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        userId: req.userId,
        createdAt: { gte: thirtyDaysAgo }
      },
      select: {
        moodScore: true,
        energy: true,
        stress: true,
        anxiety: true,
        sleep: true,
        activities: true,
        socialContext: true,
        weather: true,
        createdAt: true
      }
    });

    if (moodEntries.length < 5) {
      return res.status(400).json({
        error: 'Insufficient Data',
        message: 'At least 5 mood entries required for correlation analysis'
      });
    }

    // Analyze sleep correlation
    const sleepCorrelation = {
      goodSleep: moodEntries.filter(e => e.sleep >= 7),
      poorSleep: moodEntries.filter(e => e.sleep < 6)
    };

    const sleepAnalysis = {
      goodSleepAvgMood: sleepCorrelation.goodSleep.length > 0 ? 
        Math.round((sleepCorrelation.goodSleep.reduce((sum, e) => sum + e.moodScore, 0) / sleepCorrelation.goodSleep.length) * 10) / 10 : null,
      poorSleepAvgMood: sleepCorrelation.poorSleep.length > 0 ? 
        Math.round((sleepCorrelation.poorSleep.reduce((sum, e) => sum + e.moodScore, 0) / sleepCorrelation.poorSleep.length) * 10) / 10 : null
    };

    // Analyze activity correlations
    const activityImpact = {};
    moodEntries.forEach(entry => {
      entry.activities.forEach(activity => {
        if (!activityImpact[activity]) {
          activityImpact[activity] = {
            moodScores: [],
            count: 0
          };
        }
        activityImpact[activity].moodScores.push(entry.moodScore);
        activityImpact[activity].count++;
      });
    });

    const activityAnalysis = Object.entries(activityImpact)
      .filter(([_, data]) => data.count >= 3) // Only include activities with 3+ occurrences
      .map(([activity, data]) => ({
        activity,
        averageMood: Math.round((data.moodScores.reduce((sum, score) => sum + score, 0) / data.count) * 10) / 10,
        occurrences: data.count
      }))
      .sort((a, b) => b.averageMood - a.averageMood);

    // Analyze social context correlation
    const socialImpact = {};
    moodEntries.forEach(entry => {
      if (entry.socialContext) {
        if (!socialImpact[entry.socialContext]) {
          socialImpact[entry.socialContext] = {
            moodScores: [],
            count: 0
          };
        }
        socialImpact[entry.socialContext].moodScores.push(entry.moodScore);
        socialImpact[entry.socialContext].count++;
      }
    });

    const socialAnalysis = Object.entries(socialImpact)
      .map(([context, data]) => ({
        context,
        averageMood: Math.round((data.moodScores.reduce((sum, score) => sum + score, 0) / data.count) * 10) / 10,
        occurrences: data.count
      }))
      .sort((a, b) => b.averageMood - a.averageMood);

    // Day of week analysis
    const dayOfWeekAnalysis = {};
    moodEntries.forEach(entry => {
      const dayOfWeek = new Date(entry.createdAt).getDay();
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
      
      if (!dayOfWeekAnalysis[dayName]) {
        dayOfWeekAnalysis[dayName] = {
          moodScores: [],
          stressScores: [],
          count: 0
        };
      }
      
      dayOfWeekAnalysis[dayName].moodScores.push(entry.moodScore);
      dayOfWeekAnalysis[dayName].stressScores.push(entry.stress);
      dayOfWeekAnalysis[dayName].count++;
    });

    const weeklyPattern = Object.entries(dayOfWeekAnalysis)
      .map(([day, data]) => ({
        day,
        averageMood: Math.round((data.moodScores.reduce((sum, score) => sum + score, 0) / data.count) * 10) / 10,
        averageStress: Math.round((data.stressScores.reduce((sum, score) => sum + score, 0) / data.count) * 10) / 10,
        entryCount: data.count
      }));

    res.status(200).json({
      dataPointsAnalyzed: moodEntries.length,
      sleep: {
        analysis: sleepAnalysis,
        impact: sleepAnalysis.goodSleepAvgMood && sleepAnalysis.poorSleepAvgMood ? 
          Math.round((sleepAnalysis.goodSleepAvgMood - sleepAnalysis.poorSleepAvgMood) * 10) / 10 : null
      },
      activities: {
        topPositive: activityAnalysis.slice(0, 5),
        topNegative: activityAnalysis.slice(-3).reverse()
      },
      socialContext: socialAnalysis,
      weeklyPattern: weeklyPattern,
      insights: [
        ...(sleepAnalysis.goodSleepAvgMood > sleepAnalysis.poorSleepAvgMood + 1 ? 
          [`Good sleep (7+ hours) improves your mood by ${Math.round((sleepAnalysis.goodSleepAvgMood - sleepAnalysis.poorSleepAvgMood) * 10) / 10} points on average`] : []),
        ...(activityAnalysis.length > 0 ? 
          [`${activityAnalysis[0].activity} appears to have the most positive impact on your mood`] : []),
        ...(socialAnalysis.length > 0 ? 
          [`You tend to feel best when ${socialAnalysis[0].context}`] : [])
      ]
    });

  } catch (error) {
    console.error('Correlations analytics error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve correlation analysis'
    });
  }
});

/**
 * GET /api/analytics/export
 * Export user data for external analysis
 */
router.get('/export', authenticateToken, [
  query('format').optional().isIn(['json', 'csv']).withMessage('Invalid format'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date')
], checkValidation, async (req, res) => {
  try {
    const format = req.query.format || 'json';
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

    // Build date filter
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        gte: startDate,
        lte: endDate
      };
    } else if (startDate) {
      dateFilter.createdAt = { gte: startDate };
    } else if (endDate) {
      dateFilter.createdAt = { lte: endDate };
    }

    // Get all user data
    const [moodEntries, journalEntries, activities, goals] = await Promise.all([
      prisma.moodEntry.findMany({
        where: {
          userId: req.userId,
          ...dateFilter
        },
        orderBy: { createdAt: 'desc' }
      }),
      
      prisma.journalEntry.findMany({
        where: {
          userId: req.userId,
          ...dateFilter
        },
        orderBy: { createdAt: 'desc' }
      }),
      
      prisma.activity.findMany({
        where: {
          userId: req.userId,
          ...dateFilter
        },
        orderBy: { createdAt: 'desc' }
      }),
      
      prisma.goal.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      dateRange: {
        start: startDate?.toISOString() || 'all time',
        end: endDate?.toISOString() || 'present'
      },
      summary: {
        moodEntries: moodEntries.length,
        journalEntries: journalEntries.length,
        activities: activities.length,
        goals: goals.length
      },
      data: {
        moodEntries,
        journalEntries,
        activities,
        goals
      }
    };

    if (format === 'csv') {
      // For CSV, flatten the mood entries as they're the primary data
      const csvData = moodEntries.map(entry => ({
        date: entry.createdAt.toISOString().split('T')[0],
        mood: entry.moodScore,
        moodType: entry.moodType,
        energy: entry.energy,
        anxiety: entry.anxiety,
        stress: entry.stress,
        sleep: entry.sleep,
        activities: entry.activities.join(';'),
        socialContext: entry.socialContext || '',
        weather: entry.weather || '',
        notes: entry.notes || ''
      }));

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="mental-health-data.csv"');
      
      // Simple CSV conversion
      const headers = Object.keys(csvData[0] || {});
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n');
      
      res.send(csvContent);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="mental-health-data.json"');
      res.json(exportData);
    }

  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to export data'
    });
  }
});

export default router; 