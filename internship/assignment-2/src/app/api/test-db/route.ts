// API endpoint to test database connections
import { NextResponse } from 'next/server';
import { supabase, connectToMongoDB } from '@/lib/database';

interface DatabaseResult {
  status: 'unknown' | 'connected' | 'error' | 'not_configured';
  error: string | null;
}

interface TestResults {
  supabase: DatabaseResult;
  mongodb: DatabaseResult;
  timestamp: string;
}

export async function GET() {
  const results: TestResults = {
    supabase: { status: 'unknown', error: null },
    mongodb: { status: 'unknown', error: null },
    timestamp: new Date().toISOString()
  };

  // Test Supabase connection
  try {
    if (!supabase) {
      results.supabase = { 
        status: 'not_configured', 
        error: 'Supabase environment variables not set' 
      };
    } else {
      const { error } = await supabase
        .from('blog_summaries')
        .select('count(*)')
        .limit(1);
      
      if (error) {
        results.supabase = { status: 'error', error: error.message };
      } else {
        results.supabase = { status: 'connected', error: null };
      }
    }
  } catch (error) {
    results.supabase = { status: 'error', error: String(error) };
  }

  // Test MongoDB connection
  try {
    if (!process.env.MONGODB_URI) {
      results.mongodb = { 
        status: 'not_configured', 
        error: 'MongoDB URI environment variable not set' 
      };
    } else {
      const db = await connectToMongoDB();
      await db.admin().ping();
      results.mongodb = { status: 'connected', error: null };
    }
  } catch (error) {
    results.mongodb = { status: 'error', error: String(error) };
  }

  return NextResponse.json(results);
} 