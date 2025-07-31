# Environment Variables Setup

To run the Mental Health Tracker API locally, you need to create a `.env` file in the `api` directory with the following variables:

## Required Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development
LOG_LEVEL=info

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mental-health-tracker
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# JWT Secrets
JWT_SECRET=your-jwt-secret-key-here
JWT_REFRESH_SECRET=your-jwt-refresh-secret-key-here
JWT_MAGIC_SECRET=your-jwt-magic-secret-key-here

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-email-app-password
EMAIL_FROM=Mental Health Tracker <noreply@mentalhealthtracker.com>

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Setup Instructions

1. Create a `.env` file in the `api` directory
2. Copy the above variables and replace the placeholder values with your actual credentials
3. For development, you can use dummy values for most variables except:
   - `OPENAI_API_KEY` (if you want to test AI features)
   - `MONGODB_URI` (if you have MongoDB running locally)

## Quick Development Setup

For quick testing without setting up all services, you can use these minimal values:

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mental-health-tracker
SUPABASE_URL=https://dummy.supabase.co
SUPABASE_ANON_KEY=dummy-key
JWT_SECRET=dev-secret-key
JWT_REFRESH_SECRET=dev-refresh-secret
JWT_MAGIC_SECRET=dev-magic-secret
OPENAI_API_KEY=sk-your-openai-key
EMAIL_USER=dummy@gmail.com
EMAIL_APP_PASSWORD=dummy-password
EMAIL_FROM=Mental Health Tracker <noreply@mentalhealthtracker.com>
FRONTEND_URL=http://localhost:3000
```

## Current Error

The server is currently failing because the Supabase URL is missing. You need to either:
1. Set up a real Supabase project and use those credentials
2. Use dummy values for development (the server will show warnings but continue)
3. Modify the database initialization to handle missing Supabase credentials gracefully 