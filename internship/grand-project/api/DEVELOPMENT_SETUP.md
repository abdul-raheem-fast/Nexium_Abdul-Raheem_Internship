# Development Setup Guide

## Quick Start (No Database Required)

The server is now configured to run in development mode without requiring a full database setup.

### 1. Create Environment File

Create a `.env` file in the `api` directory with these minimal settings:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
LOG_LEVEL=info

# JWT Secrets (Required)
JWT_SECRET=dev-secret-key-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
JWT_MAGIC_SECRET=dev-magic-secret-change-in-production

# OpenAI Configuration (Required for AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 2. Start the Server

```bash
npm run dev
```

### 3. Test Magic Link Authentication

1. Send a POST request to `http://localhost:3001/api/auth/magic-link`
2. Body: `{ "email": "test@example.com" }`
3. Check the console for the magic link (in development mode)
4. The response will include a `devMagicLink` field for easy testing

### 4. Development Features

- ✅ **In-memory user storage** - No database required
- ✅ **Console logging** - Magic links printed to console
- ✅ **Mock email sending** - No email setup required
- ✅ **Graceful error handling** - Server continues even with missing services

## Full Setup (With Database)

If you want to use the full database features:

### 1. MongoDB Setup
```env
MONGODB_URI=mongodb://localhost:27017/mental-health-tracker
```

### 2. Supabase Setup
```env
DATABASE_URL=postgresql://username:password@localhost:5432/mental_health_tracker
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Email Setup
```env
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-email-app-password
```

## API Endpoints

### Authentication
- `POST /api/auth/magic-link` - Send magic link
- `POST /api/auth/verify` - Verify magic link
- `POST /api/auth/refresh` - Refresh token

### Health Check
- `GET /health` - Server health status

## Development Notes

- The server will show warnings for missing database connections but continue running
- Magic links are logged to console in development mode
- Users are stored in memory and will be lost on server restart
- All AI features require a valid OpenAI API key 