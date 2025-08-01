import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../../lib/database';
import { MoodEntry } from '../../../lib/models';

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

// Helper function to create mock data for new users
async function createMockDataForUser(userId: string) {
  const mockEntries = [
    {
      userId: userId,
      moodScore: 8,
      moodType: 'GOOD',
      energy: 7,
      anxiety: 3,
      stress: 4,
      sleep: 8,
      activities: ['Exercise', 'Meditation'],
      notes: 'Great workout session, feeling energized!',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    },
    {
      userId: userId,
      moodScore: 7,
      moodType: 'OKAY',
      energy: 6,
      anxiety: 4,
      stress: 5,
      sleep: 7,
      activities: ['Reading', 'Social'],
      notes: 'Had a nice chat with friends',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      userId: userId,
      moodScore: 9,
      moodType: 'GREAT',
      energy: 8,
      anxiety: 2,
      stress: 3,
      sleep: 9,
      activities: ['Exercise', 'Work'],
      notes: 'Productive day at work, completed major project',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    },
    {
      userId: userId,
      moodScore: 6,
      moodType: 'OKAY',
      energy: 5,
      anxiety: 5,
      stress: 6,
      sleep: 6,
      activities: ['Social'],
      notes: 'Bit tired but good day overall',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      userId: userId,
      moodScore: 8,
      moodType: 'GOOD',
      energy: 7,
      anxiety: 3,
      stress: 4,
      sleep: 8,
      activities: ['Exercise', 'Meditation', 'Reading'],
      notes: 'Morning routine was perfect',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      userId: userId,
      moodScore: 7,
      moodType: 'OKAY',
      energy: 6,
      anxiety: 4,
      stress: 5,
      sleep: 7,
      activities: ['Work', 'Reading'],
      notes: 'Focused work day, made good progress',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    }
  ];

  // Save all mock entries to database
  for (const entry of mockEntries) {
    const moodEntry = new MoodEntry(entry);
    await moodEntry.save();
  }

  return mockEntries;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const decoded = verifyToken(request);
    
    const body = await request.json();
    const { moodScore, moodType, energy, anxiety, stress, sleep, activities, notes } = body;

    // Connect to database
    const db = await connectDB();

    // Create mood entry
    const moodEntry = new MoodEntry({
      userId: decoded.email, // Add user ID
      moodScore,
      moodType,
      energy,
      anxiety,
      stress,
      sleep,
      activities,
      notes,
      createdAt: new Date(),
    });

    await moodEntry.save();

    return NextResponse.json({
      success: true,
      moodEntry,
    });

  } catch (error: any) {
    console.error('Mood entry error:', error);
    
    if (error.message === 'No authorization token provided' || error.message === 'Invalid token') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 401 }
      );
    }
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create mood entry' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const decoded = verifyToken(request);
    
    // Connect to database
    const db = await connectDB();

    // Get mood entries for the specific user, sorted by creation date (newest first)
    const moodEntries = await MoodEntry.find({ userId: decoded.email })
      .sort({ createdAt: -1 })
      .exec();

    // If no entries found, create mock data for this user
    if (moodEntries.length === 0) {
      console.log(`Creating mock data for new user: ${decoded.email}`);
      await createMockDataForUser(decoded.email);
      
      // Fetch the newly created entries
      const newEntries = await MoodEntry.find({ userId: decoded.email })
        .sort({ createdAt: -1 })
        .exec();
      
      return NextResponse.json({
        success: true,
        moodEntries: newEntries,
      });
    }

    return NextResponse.json({
      success: true,
      moodEntries,
    });

  } catch (error: any) {
    console.error('Get moods error:', error);
    
    if (error.message === 'No authorization token provided' || error.message === 'Invalid token') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 401 }
      );
    }
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get mood entries' },
      { status: 500 }
    );
  }
} 