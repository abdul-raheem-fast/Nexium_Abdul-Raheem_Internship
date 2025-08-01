import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
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

    // Return mock AI recommendations data
    const recommendationsData = {
      activities: [
        {
          name: "Morning Meditation",
          description: "Start your day with 10 minutes of mindfulness",
          duration: "10 minutes",
          category: "Wellness",
          moodImpact: "High"
        },
        {
          name: "Light Exercise",
          description: "Take a 20-minute walk or do some stretching",
          duration: "20 minutes",
          category: "Physical",
          moodImpact: "High"
        },
        {
          name: "Social Connection",
          description: "Call a friend or family member",
          duration: "15 minutes",
          category: "Social",
          moodImpact: "Medium"
        },
        {
          name: "Creative Activity",
          description: "Draw, write, or engage in a hobby",
          duration: "30 minutes",
          category: "Creative",
          moodImpact: "Medium"
        }
      ],
      suggestions: [
        "Based on your mood patterns, morning activities seem to work best for you",
        "Consider scheduling social activities in the afternoon when your energy is higher",
        "Your mood improves significantly after physical activity - try to exercise regularly",
        "Sleep quality strongly affects your next-day mood - prioritize good sleep hygiene"
      ]
    };

    return NextResponse.json(recommendationsData);

  } catch (error: any) {
    console.error('AI recommendations error:', error);
    
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
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
} 