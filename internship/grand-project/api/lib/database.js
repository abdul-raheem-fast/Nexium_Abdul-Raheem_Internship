import mongoose from 'mongoose';
import { createClient } from '@supabase/supabase-js';

// MongoDB connection
const connectMongoDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.log('⚠️ MongoDB URI not provided - using in-memory database for development');
    return null;
  }
  
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️ Continuing without MongoDB - some features may be limited');
    return null;
  }
};

// Supabase client for file storage and additional features
let supabase = null;

const initializeSupabase = () => {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    try {
      supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
          db: {
            schema: 'public',
          },
          global: {
            headers: { 'x-my-custom-header': 'mental-health-tracker' },
          },
        }
      );
      console.log('✅ Supabase client initialized');
    } catch (error) {
      console.log('⚠️ Supabase initialization error:', error.message);
      supabase = null;
    }
  } else {
    console.log('⚠️ Supabase credentials not provided - some features may be limited');
  }
};

// Test Supabase connection
const testSupabaseConnection = async () => {
  if (!supabase) {
    console.log('⚠️ Supabase not configured - skipping connection test');
    return false;
  }
  
  try {
    // Test with a simple query that should work
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);
    
    if (error) {
      console.log('⚠️ Supabase connection warning:', error.message);
      return false;
    } else {
      console.log('✅ Supabase Connected Successfully');
      return true;
    }
  } catch (error) {
    console.log('⚠️ Supabase connection error:', error.message);
    return false;
  }
};

// Create tables in Supabase if they don't exist
const createSupabaseTables = async () => {
  if (!supabase) {
    console.log('⚠️ Supabase not available - skipping table creation');
    return;
  }

  try {
    // Create users table
    const { error: usersError } = await supabase.rpc('create_users_table_if_not_exists');
    if (usersError && !usersError.message.includes('already exists')) {
      console.log('⚠️ Users table creation warning:', usersError.message);
    }

    // Create mood_entries table
    const { error: moodError } = await supabase.rpc('create_mood_entries_table_if_not_exists');
    if (moodError && !moodError.message.includes('already exists')) {
      console.log('⚠️ Mood entries table creation warning:', moodError.message);
    }

    console.log('✅ Supabase tables initialized');
  } catch (error) {
    console.log('⚠️ Supabase table creation error:', error.message);
  }
};

// Initialize all database connections
const initializeDatabases = async () => {
  console.log('🔧 Initializing databases...');
  
  // Initialize Supabase first
  initializeSupabase();
  
  // Test Supabase connection
  const supabaseConnected = await testSupabaseConnection();
  
  // Connect to MongoDB
  const mongoConnection = await connectMongoDB();
  
  // Create Supabase tables if connected
  if (supabaseConnected) {
    await createSupabaseTables();
  }
  
  console.log('🔧 Database initialization complete');
  
  return {
    mongodb: mongoConnection,
    supabase: supabaseConnected,
  };
};

export {
  connectMongoDB,
  supabase,
  initializeDatabases
};
