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

// GET - Get specific mood entry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const decoded = verifyToken(request);

    // Connect to database
    const db = await connectDB();

    // Find mood entry by ID and user
    const moodEntry = await MoodEntry.findOne({ 
      _id: id, 
      userId: decoded.email 
    }).exec();

    if (!moodEntry) {
      // Return mock data for demo purposes
      const mockEntry = {
        id: id,
        userId: decoded.email,
        moodScore: 8,
        moodType: 'GOOD',
        energy: 7,
        anxiety: 3,
        stress: 4,
        sleep: 8,
        activities: ['Exercise', 'Meditation'],
        notes: 'Great workout session, feeling energized!',
        tags: ['productive', 'active'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return NextResponse.json({
        success: true,
        moodEntry: mockEntry,
      });
    }

    return NextResponse.json({
      success: true,
      moodEntry,
    });

  } catch (error: any) {
    console.error('Get mood entry error:', error);
    
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
      { error: 'Failed to get mood entry' },
      { status: 500 }
    );
  }
}

// PUT - Update mood entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const decoded = verifyToken(request);
    const body = await request.json();

    // Connect to database
    const db = await connectDB();

    // Find and update mood entry
    const updatedEntry = await MoodEntry.findOneAndUpdate(
      { _id: id, userId: decoded.email },
      {
        ...body,
        updatedAt: new Date(),
      },
      { new: true }
    ).exec();

    if (!updatedEntry) {
      return NextResponse.json(
        { error: 'Mood entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      moodEntry: updatedEntry,
    });

  } catch (error: any) {
    console.error('Update mood entry error:', error);
    
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
      { error: 'Failed to update mood entry' },
      { status: 500 }
    );
  }
}

// DELETE - Delete mood entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const decoded = verifyToken(request);

    // Connect to database
    const db = await connectDB();

    // Find and delete mood entry
    const deletedEntry = await MoodEntry.findOneAndDelete({
      _id: id,
      userId: decoded.email
    }).exec();

    if (!deletedEntry) {
      return NextResponse.json(
        { error: 'Mood entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mood entry deleted successfully',
    });

  } catch (error: any) {
    console.error('Delete mood entry error:', error);
    
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
      { error: 'Failed to delete mood entry' },
      { status: 500 }
    );
  }
} 