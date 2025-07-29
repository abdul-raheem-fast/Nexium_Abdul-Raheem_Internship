import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to create a mood entry' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const { moodScore, activities, notes, sleepHours, date } = await req.json();
    
    // Validate required fields
    if (moodScore === undefined || moodScore === null) {
      return NextResponse.json(
        { error: 'Mood score is required' },
        { status: 400 }
      );
    }
    
    // Create mood entry in database
    const moodEntry = await prisma.moodEntry.create({
      data: {
        userId: session.user.id,
        moodScore,
        activities: activities || [],
        notes: notes || '',
        sleepHours: sleepHours || 0,
        date: date ? new Date(date) : new Date(),
      },
    });
    
    return NextResponse.json({ success: true, data: moodEntry }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating mood entry:', error);
    
    return NextResponse.json(
      { error: 'Failed to create mood entry', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to view mood entries' },
        { status: 401 }
      );
    }
    
    // Get URL parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '30');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Get mood entries for the user
    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: 'desc',
      },
      take: limit,
      skip,
    });
    
    // Get total count for pagination
    const total = await prisma.moodEntry.count({
      where: {
        userId: session.user.id,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: moodEntries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching mood entries:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch mood entries', details: error.message },
      { status: 500 }
    );
  }
}