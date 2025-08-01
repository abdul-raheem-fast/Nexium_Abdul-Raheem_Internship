import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../lib/database";
import { MoodEntry } from "../../../lib/models";

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No authorization token provided");
  }

  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
  
  if (!decoded) {
    throw new Error("Invalid token");
  }
  
  return decoded;
}

// Helper function to get user ID from token
function getUserId(decoded: any): string {
  // Handle both userId and email fields for backward compatibility
  return decoded.userId || decoded.email || "";
}

// Helper function to create mock data for new users
async function createMockDataForUser(userId: string) {
  const mockEntries = [
    {
      userId: userId,
      moodScore: 8,
      moodType: "GOOD",
      energy: 7,
      anxiety: 3,
      stress: 4,
      sleep: 8,
      activities: ["Exercise", "Meditation"],
      notes: "Great workout session, feeling energized!",
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    },
    {
      userId: userId,
      moodScore: 7,
      moodType: "OKAY",
      energy: 6,
      anxiety: 4,
      stress: 5,
      sleep: 7,
      activities: ["Reading", "Social"],
      notes: "Had a nice chat with friends",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      userId: userId,
      moodScore: 9,
      moodType: "GREAT",
      energy: 8,
      anxiety: 2,
      stress: 3,
      sleep: 9,
      activities: ["Exercise", "Work"],
      notes: "Productive day at work, completed major project",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    },
    {
      userId: userId,
      moodScore: 6,
      moodType: "OKAY",
      energy: 5,
      anxiety: 5,
      stress: 6,
      sleep: 6,
      activities: ["Social"],
      notes: "Bit tired but good day overall",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      userId: userId,
      moodScore: 8,
      moodType: "GOOD",
      energy: 7,
      anxiety: 3,
      stress: 4,
      sleep: 8,
      activities: ["Exercise", "Meditation", "Reading"],
      notes: "Morning routine was perfect",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      userId: userId,
      moodScore: 7,
      moodType: "OKAY",
      energy: 6,
      anxiety: 4,
      stress: 5,
      sleep: 7,
      activities: ["Work", "Reading"],
      notes: "Focused work day, made good progress",
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
    console.log("POST /api/moods - Starting request");
    
    // Verify authentication
    const decoded = verifyToken(request);
    const userId = getUserId(decoded);
    console.log("POST /api/moods - Token verified for user:", userId);
    
    const body = await request.json();
    console.log("POST /api/moods - Request body:", body);
    
    const { moodScore, moodType, energy, anxiety, stress, sleep, activities, notes } = body;

    // Validate required fields
    if (!moodScore || !moodType) {
      return NextResponse.json(
        { error: "Mood score and mood type are required" },
        { status: 400 }
      );
    }

    // Validate mood score range
    if (moodScore < 1 || moodScore > 10) {
      return NextResponse.json(
        { error: "Mood score must be between 1 and 10" },
        { status: 400 }
      );
    }

    // Validate mood type - accept all mood types from the frontend form
    const validMoodTypes = [
      'GREAT', 'GOOD', 'OKAY', 'BAD', 'TERRIBLE', 'EXCITED', 'CALM', 'ANXIOUS', 'SAD', 'ANGRY', 'CONFUSED', 'GRATEFUL', 'HOPEFUL'
    ];
    if (!validMoodTypes.includes(moodType)) {
      return NextResponse.json(
        { error: "Invalid mood type" },
        { status: 400 }
      );
    }

    // Connect to database
    console.log("POST /api/moods - Connecting to database...");
    try {
      await connectDB();
      console.log("POST /api/moods - Database connected successfully");
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Create mood entry with proper data types
    const moodEntryData = {
      userId: userId,
      moodScore: parseInt(moodScore),
      moodType: moodType,
      energy: energy ? parseInt(energy) : 5,
      anxiety: anxiety ? parseInt(anxiety) : 3,
      stress: stress ? parseInt(stress) : 3,
      sleep: sleep ? Math.round(parseFloat(sleep)) : 7, // Round to nearest integer
      activities: activities || [],
      notes: notes || "",
      createdAt: new Date(),
    };
    
    console.log("POST /api/moods - Creating mood entry with data:", moodEntryData);
    
    let moodEntry;
    try {
      moodEntry = new MoodEntry(moodEntryData);
      await moodEntry.save();
      
      console.log("POST /api/moods - Mood entry saved successfully:", moodEntry._id);
    } catch (saveError) {
      console.error("Mood entry save error:", saveError);
      return NextResponse.json(
        { error: "Failed to save mood entry to database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      moodEntry,
    });

  } catch (error: any) {
    console.error("Mood entry error:", error);
    console.error("Error stack:", error.stack);
    
    if (error.message === "No authorization token provided" || error.message === "Invalid token") {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        { error: "Token has expired" },
        { status: 401 }
      );
    }
    
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create mood entry: " + error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/moods - Starting request");
    
    // Verify authentication
    const decoded = verifyToken(request);
    const userId = getUserId(decoded);
    console.log("GET /api/moods - Token verified for user:", userId);
    
    // Connect to database
    console.log("GET /api/moods - Connecting to database...");
    try {
      await connectDB();
      console.log("GET /api/moods - Database connected successfully");
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Get mood entries for the specific user, sorted by creation date (newest first)
    console.log("GET /api/moods - Fetching mood entries for user:", userId);
    const moodEntries = await MoodEntry.find({ userId: userId })
      .sort({ createdAt: -1 })
      .exec();
    
    console.log("GET /api/moods - Found entries:", moodEntries.length);

    // If no entries found, create mock data for this user
    if (moodEntries.length === 0) {
      console.log(`Creating mock data for new user: ${userId}`);
      await createMockDataForUser(userId);
      
      // Fetch the newly created entries
      const newEntries = await MoodEntry.find({ userId: userId })
        .sort({ createdAt: -1 })
        .exec();
      
      console.log("GET /api/moods - Created and fetched new entries:", newEntries.length);
      
      return NextResponse.json({
        success: true,
        moodEntries: newEntries,
      });
    }

    console.log("GET /api/moods - Returning existing entries:", moodEntries.length);
    return NextResponse.json({
      success: true,
      moodEntries,
    });

  } catch (error: any) {
    console.error("Get moods error:", error);
    console.error("Error stack:", error.stack);
    
    if (error.message === "No authorization token provided" || error.message === "Invalid token") {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        { error: "Token has expired" },
        { status: 401 }
      );
    }
    
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to get mood entries: " + error.message },
      { status: 500 }
    );
  }
} 