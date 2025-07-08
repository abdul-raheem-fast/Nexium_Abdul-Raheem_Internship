// Database Connection Utilities for Assignment 2

import { createClient } from '@supabase/supabase-js';
import { MongoClient } from 'mongodb';

// Environment variable validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const mongoUri = process.env.MONGODB_URI;

// Create Supabase client only if environment variables are available
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// MongoDB Configuration
let cachedClient: MongoClient | null = null;

export async function connectToMongoDB(): Promise<MongoClient> {
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Database Schema Types
export interface BlogSummary {
  id?: string;
  url: string;
  title: string;
  summary: string;
  urdu_summary: string;
  created_at?: string;
  word_count?: number;
}

export interface BlogContent {
  _id?: string;
  url: string;
  title: string;
  content: string;
  scraped_at: Date;
  metadata?: {
    author?: string;
    publish_date?: string;
    tags?: string[];
  };
}

// Supabase Operations (for summaries)
export async function saveSummaryToSupabase(summary: Omit<BlogSummary, 'id' | 'created_at'>) {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check environment variables.');
  }

  const { data, error } = await supabase
    .from('blog_summaries')
    .insert(summary)
    .select()
    .single();

  if (error) {
    console.error('Error saving to Supabase:', error);
    throw error;
  }

  return data;
}

export async function getSummariesFromSupabase(limit = 10) {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check environment variables.');
  }

  const { data, error } = await supabase
    .from('blog_summaries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching from Supabase:', error);
    throw error;
  }

  return data;
}

// MongoDB Operations (for full content)
export async function saveContentToMongoDB(content: Omit<BlogContent, '_id'>) {
  try {
    const client = await connectToMongoDB();
    const db = client.db('blog-summarizer');
    const collection = db.collection('blog_contents');

    const result = await collection.insertOne(content);
    return result;
  } catch (error) {
    console.error('Error saving to MongoDB:', error);
    throw error;
  }
}

export async function getContentFromMongoDB(url: string) {
  try {
    const client = await connectToMongoDB();
    const db = client.db('blog-summarizer');
    const collection = db.collection('blog_contents');

    const content = await collection.findOne({ url });
    return content;
  } catch (error) {
    console.error('Error fetching from MongoDB:', error);
    throw error;
  }
} 