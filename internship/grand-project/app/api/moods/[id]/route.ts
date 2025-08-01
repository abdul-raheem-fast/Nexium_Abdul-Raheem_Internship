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

// Helper function to get user ID from token
function getUserId(decoded: any): string {
  // Handle both userId and email fields for backward compatibility
  return decoded.userId || decoded.email || "";
}

// GET - Get specific mood entry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const decoded = verifyToken(request);
    const userId = getUserId(decoded);

    // Connect to database
    try {
      await connectDB();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Check if the ID is a fallback ID (like "entry-1") or a real MongoDB ID
    let moodEntry;
    
    if (id.startsWith('entry-')) {
      // This is a fallback ID, return mock data
      const mockEntry = {
        id: id,
        userId: userId,
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
    } else {
      // This is a real MongoDB ID, try to find the entry
      try {
        moodEntry = await MoodEntry.findOne({ 
          _id: id, 
          userId: userId 
        }).exec();

        if (!moodEntry) {
          return NextResponse.json(
            { error: 'Mood entry not found' },
            { status: 404 }
          );
        }
      } catch (dbError) {
        console.error("Database query error:", dbError);
        return NextResponse.json(
          { error: 'Invalid mood entry ID or database error' },
          { status: 400 }
        );
      }
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
    const userId = getUserId(decoded);
    const body = await request.json();

    // Connect to database
    try {
      await connectDB();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Check if the ID is a fallback ID (like "entry-1")
    if (id.startsWith('entry-')) {
      return NextResponse.json({
        success: true,
        moodEntry: {
          id: id,
          userId: userId,
          ...body,
          updatedAt: new Date().toISOString()
        },
      });
    }

    // Find and update mood entry
    try {
      const updatedEntry = await MoodEntry.findOneAndUpdate(
        { _id: id, userId: userId },
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
    } catch (dbError) {
      console.error("Database query error:", dbError);
      return NextResponse.json(
        { error: 'Invalid mood entry ID or database error' },
        { status: 400 }
      );
    }

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
  console.log(`DELETE request for mood entry ID: ${id}`);
  
  try {
    const decoded = verifyToken(request);
    const userId = getUserId(decoded);
    console.log(`User ID from token: ${userId}`);

    // Connect to database
    try {
      await connectDB();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Check if the ID is a fallback ID (like "entry-1")
    if (id.startsWith('entry-')) {
      return NextResponse.json({
        success: true,
        message: 'Mock mood entry deleted successfully',
      });
    }

    // Find and delete mood entry
    try {
      console.log(`Attempting to delete mood entry with ID: ${id} for user: ${userId}`);
      
      const deletedEntry = await MoodEntry.findOneAndDelete({
        _id: id,
        userId: userId
      }).exec();

      if (!deletedEntry) {
        console.log(`No mood entry found with ID: ${id} for user: ${userId}`);
        return NextResponse.json(
          { error: 'Mood entry not found' },
          { status: 404 }
        );
      }

      console.log(`Successfully deleted mood entry: ${id}`);
      return NextResponse.json({
        success: true,
        message: 'Mood entry deleted successfully',
      });
    } catch (dbError) {
      console.error("Database query error:", dbError);
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 400 }
      );
    }

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