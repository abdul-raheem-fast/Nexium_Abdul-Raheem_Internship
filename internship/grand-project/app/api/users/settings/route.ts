import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify the access token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // In a real application, you would save these settings to the database
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: {
        aiInsightsEnabled: body.aiInsightsEnabled ?? true,
        notificationsEnabled: body.notificationsEnabled ?? true,
        theme: body.theme ?? 'system',
        ...body
      }
    });

  } catch (error: any) {
    console.error('User settings error:', error);
    
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
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
} 