import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify the magic link token
    const decoded = jwt.verify(token, process.env.JWT_MAGIC_SECRET!) as any;
    
    if (!decoded || decoded.type !== 'magic-link') {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Generate access and refresh tokens
    const accessToken = jwt.sign(
      { userId: decoded.email, email: decoded.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: decoded.email, email: decoded.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      tokens: {
        accessToken,
        refreshToken
      },
      user: {
        email: decoded.email,
        id: decoded.email
      }
    });

  } catch (error: any) {
    console.error('Token verification error:', error);
    
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
      { error: 'Failed to verify token' },
      { status: 500 }
    );
  }
} 