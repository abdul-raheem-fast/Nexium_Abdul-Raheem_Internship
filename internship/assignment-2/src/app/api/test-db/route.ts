// API endpoint to test database connections
import { NextResponse } from 'next/server';
import { supabase, connectToMongoDB } from '@/lib/database';

export async function GET() {
  const results = {
    supabase: { status: 'unknown', error: null },
    mongodb: { status: 'unknown', error: null },
    timestamp: new Date().toISOString()
  };

  // Test Supabase connection
  try {
    const { data, error } = await supabase
      .from('blog_summaries')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      results.supabase = { status: 'error', error: error.message };
    } else {
      results.supabase = { status: 'connected', error: null };
    }
  } catch (error) {
    results.supabase = { status: 'error', error: String(error) };
  }

  // Test MongoDB connection
  try {
    const client = await connectToMongoDB();
    const db = client.db('blog-summarizer');
    await db.admin().ping();
    results.mongodb = { status: 'connected', error: null };
  } catch (error) {
    results.mongodb = { status: 'error', error: String(error) };
  }

  return NextResponse.json(results);
} 