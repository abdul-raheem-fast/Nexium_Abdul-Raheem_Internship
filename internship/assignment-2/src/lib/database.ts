// Database Connection Utilities for Assignment 2

import { createClient } from '@supabase/supabase-js';
import { MongoClient, Db, Collection } from 'mongodb';

// Supabase Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// MongoDB Configuration
const mongoUri = process.env.MONGODB_URI!;
const mongoClient = new MongoClient(mongoUri);

let cachedDb: Db | null = null;

export async function connectToMongoDB(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }
  
  try {
    await mongoClient.connect();
    cachedDb = mongoClient.db('nexium-internship');
    console.log('Connected to MongoDB');
    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Types
export interface BlogSummary {
  id?: string;
  url: string;
  title: string;
  summary: string;
  urdu_summary: string;
  word_count: number;
  reading_time: string;
  source_domain: string;
  created_at?: string;
  processed_at: string;
  content_hash: string;
}

export interface BlogContent {
  _id?: string;
  url: string;
  title: string;
  full_content: string;
  metadata: {
    scraped_at: Date;
    word_count: number;
    source_domain: string;
    content_length: number;
    extraction_method: string;
  };
  processing_stats: {
    scrape_duration: number;
    summary_duration: number;
    translation_duration: number;
  };
}

export interface WebhookActivity {
  _id?: string;
  webhook_id: string;
  trigger_type: string;
  payload: any;
  response: any;
  timestamp: Date;
  processing_time: number;
  success: boolean;
  error_message?: string;
  user_agent?: string;
  ip_address?: string;
}

// Supabase Operations
export class SupabaseService {
  // Save blog summary to Supabase
  static async saveBlogSummary(summary: BlogSummary): Promise<BlogSummary> {
    try {
      const { data, error } = await supabase
        .from('blog_summaries')
        .insert([{
          url: summary.url,
          title: summary.title,
          summary: summary.summary,
          urdu_summary: summary.urdu_summary,
          word_count: summary.word_count,
          reading_time: summary.reading_time,
          source_domain: summary.source_domain,
          processed_at: summary.processed_at,
          content_hash: summary.content_hash
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase save error:', error);
        throw new Error(`Database save failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Supabase operation failed:', error);
      throw error;
    }
  }

  // Get recent summaries
  static async getRecentSummaries(limit: number = 10): Promise<BlogSummary[]> {
    try {
      const { data, error } = await supabase
        .from('blog_summaries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Supabase fetch error:', error);
        throw new Error(`Database fetch failed: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Supabase fetch operation failed:', error);
      return [];
    }
  }

  // Check if URL already processed
  static async checkUrlExists(url: string): Promise<BlogSummary | null> {
    try {
      const { data, error } = await supabase
        .from('blog_summaries')
        .select('*')
        .eq('url', url)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Supabase check error:', error);
        throw new Error(`Database check failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('URL check failed:', error);
      return null;
    }
  }

  // Get analytics data
  static async getAnalytics() {
    try {
      const { data: summaries, error: summariesError } = await supabase
        .from('blog_summaries')
        .select('*');

      if (summariesError) {
        console.error('Analytics fetch error:', summariesError);
        throw new Error(`Analytics fetch failed: ${summariesError.message}`);
      }

      const totalSummaries = summaries?.length || 0;
      const totalWordCount = summaries?.reduce((sum, s) => sum + (s.word_count || 0), 0) || 0;
      const avgWordCount = totalSummaries > 0 ? Math.round(totalWordCount / totalSummaries) : 0;
      
      const domainStats = summaries?.reduce((acc, s) => {
        acc[s.source_domain] = (acc[s.source_domain] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const topDomains = Object.entries(domainStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

      return {
        totalSummaries,
        totalWordCount,
        avgWordCount,
        topDomains,
        recentActivity: summaries?.slice(0, 5) || []
      };
    } catch (error) {
      console.error('Analytics generation failed:', error);
      return {
        totalSummaries: 0,
        totalWordCount: 0,
        avgWordCount: 0,
        topDomains: [],
        recentActivity: []
      };
    }
  }
}

// MongoDB Operations
export class MongoService {
  // Save full blog content to MongoDB
  static async saveBlogContent(content: BlogContent): Promise<BlogContent> {
    try {
      const db = await connectToMongoDB();
      const collection: Collection<BlogContent> = db.collection('blog_contents');

      const result = await collection.insertOne(content);
      
      return {
        ...content,
        _id: result.insertedId.toString()
      };
    } catch (error) {
      console.error('MongoDB save error:', error);
      throw new Error(`MongoDB save failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get blog content by URL
  static async getBlogContentByUrl(url: string): Promise<BlogContent | null> {
    try {
      const db = await connectToMongoDB();
      const collection: Collection<BlogContent> = db.collection('blog_contents');

      const content = await collection.findOne({ url });
      return content;
    } catch (error) {
      console.error('MongoDB fetch error:', error);
      return null;
    }
  }

  // Save webhook activity
  static async saveWebhookActivity(activity: WebhookActivity): Promise<WebhookActivity> {
    try {
      const db = await connectToMongoDB();
      const collection: Collection<WebhookActivity> = db.collection('webhook_activities');

      const result = await collection.insertOne(activity);
      
      return {
        ...activity,
        _id: result.insertedId.toString()
      };
    } catch (error) {
      console.error('Webhook activity save error:', error);
      throw new Error(`Webhook activity save failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get webhook analytics
  static async getWebhookAnalytics(days: number = 7) {
    try {
      const db = await connectToMongoDB();
      const collection: Collection<WebhookActivity> = db.collection('webhook_activities');

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const activities = await collection
        .find({ timestamp: { $gte: startDate } })
        .sort({ timestamp: -1 })
        .toArray();

      const totalRequests = activities.length;
      const successfulRequests = activities.filter(a => a.success).length;
      const failedRequests = totalRequests - successfulRequests;
      const avgProcessingTime = activities.length > 0 
        ? Math.round(activities.reduce((sum, a) => sum + a.processing_time, 0) / activities.length)
        : 0;

      const triggerStats = activities.reduce((acc, a) => {
        acc[a.trigger_type] = (acc[a.trigger_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const hourlyStats = activities.reduce((acc, a) => {
        const hour = new Date(a.timestamp).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      return {
        totalRequests,
        successfulRequests,
        failedRequests,
        successRate: totalRequests > 0 ? Math.round((successfulRequests / totalRequests) * 100) : 0,
        avgProcessingTime,
        triggerStats,
        hourlyStats,
        recentActivities: activities.slice(0, 10)
      };
    } catch (error) {
      console.error('Webhook analytics error:', error);
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        successRate: 0,
        avgProcessingTime: 0,
        triggerStats: {},
        hourlyStats: {},
        recentActivities: []
      };
    }
  }

  // Get content analytics
  static async getContentAnalytics() {
    try {
      const db = await connectToMongoDB();
      const collection: Collection<BlogContent> = db.collection('blog_contents');

      const contents = await collection.find({}).toArray();
      
      const totalContent = contents.length;
      const totalWords = contents.reduce((sum, c) => sum + c.metadata.word_count, 0);
      const avgWords = totalContent > 0 ? Math.round(totalWords / totalContent) : 0;
      
      const domainStats = contents.reduce((acc, c) => {
        acc[c.metadata.source_domain] = (acc[c.metadata.source_domain] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const processingStats = {
        avgScrapeTime: contents.length > 0 
          ? Math.round(contents.reduce((sum, c) => sum + c.processing_stats.scrape_duration, 0) / contents.length)
          : 0,
        avgSummaryTime: contents.length > 0
          ? Math.round(contents.reduce((sum, c) => sum + c.processing_stats.summary_duration, 0) / contents.length)
          : 0,
        avgTranslationTime: contents.length > 0
          ? Math.round(contents.reduce((sum, c) => sum + c.processing_stats.translation_duration, 0) / contents.length)
          : 0
      };

      return {
        totalContent,
        totalWords,
        avgWords,
        domainStats,
        processingStats,
        recentContent: contents.slice(-5)
      };
    } catch (error) {
      console.error('Content analytics error:', error);
      return {
        totalContent: 0,
        totalWords: 0,
        avgWords: 0,
        domainStats: {},
        processingStats: { avgScrapeTime: 0, avgSummaryTime: 0, avgTranslationTime: 0 },
        recentContent: []
      };
    }
  }
}

// Utility functions
export function generateContentHash(content: string): string {
  // Simple hash function for content deduplication
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

export function calculateProcessingStats(startTime: number, checkpoints: number[]) {
  const endTime = Date.now();
  return {
    scrape_duration: checkpoints[0] - startTime,
    summary_duration: checkpoints[1] - checkpoints[0],
    translation_duration: endTime - checkpoints[1]
  };
}

// Health check functions
export async function checkDatabaseHealth() {
  const health = {
    supabase: false,
    mongodb: false,
    timestamp: new Date().toISOString()
  };

  try {
    // Test Supabase connection
    const { data, error } = await supabase
      .from('blog_summaries')
      .select('count', { count: 'exact', head: true })
      .limit(1);
    
    health.supabase = !error;
  } catch (error) {
    console.error('Supabase health check failed:', error);
  }

  try {
    // Test MongoDB connection
    const db = await connectToMongoDB();
    await db.admin().ping();
    health.mongodb = true;
  } catch (error) {
    console.error('MongoDB health check failed:', error);
  }

  return health;
} 