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

// Helper function to generate AI insights from mood data
function generateInsights(moodEntries: any[]) {
  if (moodEntries.length === 0) {
    return {
      recommendations: [
        "Start tracking your mood daily to gain insights into your mental wellbeing",
        "Try different activities and see how they affect your mood",
        "Establish a consistent sleep schedule for better mood stability",
        "Consider incorporating exercise into your routine"
      ],
      summary: "Welcome to your mood tracking journey! Start by creating your first mood entry to begin gaining insights into your mental wellbeing patterns.",
      patterns: [],
      riskFactors: [],
      suggestions: [
        "Create your first mood entry",
        "Set up a daily tracking routine",
        "Explore different activities",
        "Monitor your sleep patterns"
      ]
    };
  }

  // Calculate basic statistics
  const totalEntries = moodEntries.length;
  const averageMood = moodEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / totalEntries;
  const recentEntries = moodEntries.slice(0, 7); // Last 7 entries
  const recentAvg = recentEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / recentEntries.length;

  // Analyze activities and their impact
  const activityImpact: { [key: string]: { count: number, avgMood: number } } = {};
  moodEntries.forEach(entry => {
    if (entry.activities && Array.isArray(entry.activities)) {
      entry.activities.forEach((activity: string) => {
        if (!activityImpact[activity]) {
          activityImpact[activity] = { count: 0, avgMood: 0 };
        }
        activityImpact[activity].count++;
        activityImpact[activity].avgMood += entry.moodScore;
      });
    }
  });

  // Calculate average mood for each activity
  Object.keys(activityImpact).forEach(activity => {
    activityImpact[activity].avgMood /= activityImpact[activity].count;
  });

  // Find best and worst activities
  const sortedActivities = Object.entries(activityImpact)
    .sort((a, b) => b[1].avgMood - a[1].avgMood);
  
  const bestActivities = sortedActivities.slice(0, 3);
  const worstActivities = sortedActivities.slice(-3).reverse();

  // Analyze sleep patterns
  const sleepEntries = moodEntries.filter(entry => entry.sleep !== undefined);
  const avgSleep = sleepEntries.length > 0 
    ? sleepEntries.reduce((sum, entry) => sum + entry.sleep, 0) / sleepEntries.length 
    : 7;

  // Generate recommendations based on data
  const recommendations = [];
  
  if (bestActivities.length > 0) {
    const bestActivity = bestActivities[0];
    recommendations.push(
      `Keep up with ${bestActivity[0]} - your mood data shows it consistently boosts your mood to ${bestActivity[1].avgMood.toFixed(1)}/10`
    );
  }

  if (worstActivities.length > 0 && worstActivities[0][1].avgMood < 6) {
    const worstActivity = worstActivities[0];
    recommendations.push(
      `Consider reducing ${worstActivity[0]} - it's associated with lower mood scores (${worstActivity[1].avgMood.toFixed(1)}/10)`
    );
  }

  if (avgSleep < 7) {
    recommendations.push(
      `Try to get more sleep - your average is ${avgSleep.toFixed(1)} hours, and better sleep often leads to improved mood`
    );
  }

  if (recentAvg > averageMood + 0.5) {
    recommendations.push(
      "Your mood has been improving recently! Keep up whatever positive changes you've made"
    );
  } else if (recentAvg < averageMood - 0.5) {
    recommendations.push(
      "Your recent mood has been lower than usual. Consider reaching out to friends or trying activities that typically boost your mood"
    );
  }

  // Generate patterns
  const patterns = [];
  
  if (bestActivities.length > 0) {
    patterns.push({
      title: `${bestActivities[0][0]} & Mood Connection`,
      description: `Strong positive correlation between ${bestActivities[0][0]} and mood scores`,
      confidence: Math.min(0.95, 0.7 + (bestActivities[0][1].count / totalEntries) * 0.25)
    });
  }

  if (avgSleep < 7) {
    patterns.push({
      title: "Sleep Quality Impact",
      description: `Your average sleep of ${avgSleep.toFixed(1)} hours may be affecting your mood`,
      confidence: 0.85
    });
  }

  if (totalEntries >= 10) {
    patterns.push({
      title: "Mood Tracking Consistency",
      description: `You've tracked ${totalEntries} entries - great consistency!`,
      confidence: 0.9
    });
  }

  // Generate summary
  let summary = `Based on your ${totalEntries} mood entries, your average mood is ${averageMood.toFixed(1)}/10. `;
  
  if (recentAvg > averageMood) {
    summary += "Your mood has been improving recently! ";
  } else if (recentAvg < averageMood) {
    summary += "Your recent mood has been slightly lower than your average. ";
  }

  if (bestActivities.length > 0) {
    summary += `${bestActivities[0][0]} appears to be your strongest mood booster. `;
  }

  summary += "Keep tracking to discover more patterns and continue improving your mental wellbeing!";

  // Generate suggestions
  const suggestions = [];
  if (bestActivities.length > 0) {
    suggestions.push(`Increase ${bestActivities[0][0]} frequency`);
  }
  if (avgSleep < 7) {
    suggestions.push("Improve sleep hygiene");
  }
  suggestions.push("Continue daily tracking");
  if (worstActivities.length > 0 && worstActivities[0][1].avgMood < 6) {
    suggestions.push(`Reduce ${worstActivities[0][0]} when possible`);
  }

  return {
    recommendations,
    summary,
    patterns,
    riskFactors: [], // No risk factors for now
    suggestions
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

    // Generate insights from real data
    const insightsData = generateInsights(moodEntries);

    return NextResponse.json(insightsData);
  } catch (error: any) {
    console.error('AI insights error:', error);
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Token has expired' }, { status: 401 });
    }
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
} 