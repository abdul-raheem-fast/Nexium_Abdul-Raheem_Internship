import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/database';
import { MoodEntry } from '../../../lib/models';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { moodScore, moodType, energy, anxiety, stress, sleep, activities, notes } = body;

    // Connect to database
    const db = await connectDB();

    // Create mood entry
    const moodEntry = new MoodEntry({
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
    return NextResponse.json(
      { error: 'Failed to create mood entry' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    const db = await connectDB();

    // Get mood entries
    const moodEntries = await MoodEntry.find().exec();

    return NextResponse.json({
      success: true,
      moodEntries,
    });

  } catch (error: any) {
    console.error('Get moods error:', error);
    return NextResponse.json(
      { error: 'Failed to get mood entries' },
      { status: 500 }
    );
  }
} 