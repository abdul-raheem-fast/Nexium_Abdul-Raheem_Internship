import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../../../lib/database';
import { MoodEntry } from '../../../../lib/models';

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No authorization token provided');
  }

  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
  
  if (!decoded) {
    throw new Error('Invalid token');
  }
  
  return decoded;
}

// Helper function to calculate analytics from mood entries
function calculateAnalytics(moodEntries: any[]) {
  if (moodEntries.length === 0) {
    return {
      overview: {
        totalMoodEntries: 0,
        averageMood: 0,
        currentStreak: 0,
        improvement: '0%'
      },
      recentMood: {
        trend: 'stable',
        average: 0,
        entries: []
      },
      recentEntries: [],
      activityImpact: []
    };
  }

  // Calculate overview
  const totalMoodEntries = moodEntries.length;
  const averageMood = moodEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / totalMoodEntries;
  
  // Calculate current streak (consecutive days with entries)
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    
    const hasEntry = moodEntries.some(entry => {
      const entryDate = new Date(entry.createdAt);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === checkDate.getTime();
    });
    
    if (hasEntry) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate improvement (compare last 7 days vs previous 7 days)
  const last7Days = moodEntries.filter(entry => {
    const entryDate = new Date(entry.createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return entryDate >= sevenDaysAgo;
  });

  const previous7Days = moodEntries.filter(entry => {
    const entryDate = new Date(entry.createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    return entryDate >= fourteenDaysAgo && entryDate < sevenDaysAgo;
  });

  const recentAvg = last7Days.length > 0 ? last7Days.reduce((sum, entry) => sum + entry.moodScore, 0) / last7Days.length : 0;
  const previousAvg = previous7Days.length > 0 ? previous7Days.reduce((sum, entry) => sum + entry.moodScore, 0) / previous7Days.length : 0;
  
  const improvementValue = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg * 100) : 0;
  const improvement = improvementValue.toFixed(0);
  const improvementText = improvementValue > 0 ? `+${improvement}%` : `${improvement}%`;

  // Calculate recent mood trend (last 7 days)
  const recentMoodEntries = [];
  for (let i = 6; i >= 0; i--) {
    const checkDate = new Date();
    checkDate.setDate(checkDate.getDate() - i);
    checkDate.setHours(0, 0, 0, 0);
    
    const dayEntry = moodEntries.find(entry => {
      const entryDate = new Date(entry.createdAt);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === checkDate.getTime();
    });
    
    recentMoodEntries.push({
      date: checkDate.toISOString().split('T')[0],
      mood: dayEntry ? dayEntry.moodScore : 0
    });
  }

  const trend = recentAvg > previousAvg ? 'improving' : recentAvg < previousAvg ? 'declining' : 'stable';

  // Get recent entries (last 5)
  const recentEntries = moodEntries.slice(0, 5).map(entry => ({
    id: entry._id,
    moodScore: entry.moodScore,
    moodType: entry.moodType,
    createdAt: entry.createdAt,
    activities: entry.activities || [],
    notes: entry.notes || ''
  }));

  // Calculate activity impact
  const activityCounts: { [key: string]: { count: number, totalMood: number } } = {};
  
  moodEntries.forEach(entry => {
    if (entry.activities && Array.isArray(entry.activities)) {
      entry.activities.forEach((activity: string) => {
        if (!activityCounts[activity]) {
          activityCounts[activity] = { count: 0, totalMood: 0 };
        }
        activityCounts[activity].count++;
        activityCounts[activity].totalMood += entry.moodScore;
      });
    }
  });

  const activityImpact = Object.entries(activityCounts)
    .map(([activity, data]) => ({
      activity,
      impact: data.totalMood / data.count
    }))
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 5);

  return {
    overview: {
      totalMoodEntries,
      averageMood: averageMood.toFixed(1),
      currentStreak,
      improvement: improvementText
    },
    recentMood: {
      trend,
      average: recentAvg.toFixed(1),
      entries: recentMoodEntries
    },
    recentEntries,
    activityImpact
  };
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Connect to database
    const db = await connectDB();

    // Get user's mood entries
    const moodEntries = await MoodEntry.find({ userId: decoded.email })
      .sort({ createdAt: -1 })
      .exec();

    // Calculate analytics from real data
    const analyticsData = calculateAnalytics(moodEntries);

    return NextResponse.json(analyticsData);
  } catch (error: any) {
    console.error('Analytics error:', error);
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Token has expired' }, { status: 401 });
    }
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to get analytics' }, { status: 500 });
  }
} 