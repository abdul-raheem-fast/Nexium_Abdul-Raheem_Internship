# 🧠 Mental Health Tracker - Backend API

A comprehensive, AI-powered backend API for the Mental Health Tracker application. Built with Express.js, Prisma, PostgreSQL, and OpenAI integration.

## 🚀 Features

### Core Features
- **🔐 Magic Link Authentication** - Passwordless login via email
- **📊 Mood Tracking** - Comprehensive mood, energy, stress, and sleep tracking
- **📝 Digital Journaling** - Private journal entries with AI analysis
- **🎯 Goal Setting** - Wellness goals with progress tracking
- **🏆 Achievement System** - Gamified wellness milestones
- **🤖 AI Insights** - Personalized recommendations and pattern analysis
- **📈 Advanced Analytics** - Detailed trends and correlations
- **🆘 Crisis Support** - Emergency contacts and safety planning

### AI-Powered Features
- **Sentiment Analysis** - AI analysis of journal entries and mood patterns
- **Pattern Recognition** - Automatic detection of mood patterns and triggers
- **Personalized Recommendations** - AI-generated activity suggestions
- **Risk Assessment** - Crisis detection and intervention support
- **Predictive Insights** - Trend analysis and early warning systems

### Security & Privacy
- **HIPAA Compliant Design** - Healthcare data protection standards
- **JWT Authentication** - Secure token-based authentication
- **Rate Limiting** - DDoS protection and API abuse prevention
- **Data Encryption** - Encrypted sensitive data storage
- **Privacy Controls** - User-controlled data sharing and anonymization

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with magic link login
- **AI/ML:** OpenAI GPT-4 integration
- **Email:** Nodemailer with Gmail/SMTP
- **Security:** Helmet, CORS, Rate limiting
- **Logging:** Winston
- **Validation:** Joi, express-validator
- **Testing:** Jest with Supertest

## 📋 Prerequisites

- Node.js 18.0 or higher
- PostgreSQL 14+ or Supabase account
- OpenAI API key
- Email service (Gmail or SMTP)

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd mental-health-tracker/api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### 2. Environment Configuration

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mental_health_tracker"

# JWT Secrets (generate secure random strings)
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_MAGIC_SECRET="your-super-secret-magic-link-key"

# Application
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"

# Email Configuration
EMAIL_FROM="Mental Health Tracker <noreply@mentalhealthtracker.com>"
EMAIL_USER="your-email@gmail.com"
EMAIL_APP_PASSWORD="your-gmail-app-password"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"

# Optional: Supabase (alternative to local PostgreSQL)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run generate

# Run database migrations
npm run migrate

# Seed the database with initial data
npm run seed
```

### 4. Development

```bash
# Start development server
npm run dev

# The API will be available at http://localhost:3001
```

### 5. Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📡 API Documentation

### Authentication

#### Magic Link Login
```bash
# Request magic link
POST /api/auth/magic-link
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Verify Magic Link
```bash
# Verify and login
POST /api/auth/verify
Content-Type: application/json

{
  "token": "jwt-magic-link-token"
}
```

#### Refresh Token
```bash
# Refresh access token
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "jwt-refresh-token"
}
```

### Mood Tracking

#### Create Mood Entry
```bash
POST /api/moods
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "moodScore": 7,
  "moodType": "GOOD",
  "energy": 6,
  "anxiety": 3,
  "stress": 4,
  "sleep": 8,
  "activities": ["exercise", "reading"],
  "notes": "Feeling good today!",
  "socialContext": "with_friends"
}
```

#### Get Mood Entries
```bash
# Get paginated mood entries
GET /api/moods?page=1&limit=30&from=2024-01-01&to=2024-01-31

# Get today's entry
GET /api/moods/today

# Get mood trends
GET /api/moods/analytics/trends?period=month&metric=mood
```

### AI Features

#### Analyze Mood Entry
```bash
POST /api/ai/analyze-mood
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "moodEntryId": "entry-id"
}
```

#### Generate Insights
```bash
POST /api/ai/generate-insights
Authorization: Bearer <access-token>
```

#### Get Activity Recommendations
```bash
POST /api/ai/recommend-activities
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "currentMood": 5,
  "moodType": "OKAY",
  "availableTime": 30,
  "location": "home",
  "energy": 6
}
```

### Analytics

#### Dashboard Overview
```bash
GET /api/analytics/dashboard
Authorization: Bearer <access-token>
```

#### Mood Trends
```bash
GET /api/analytics/mood-trends?period=month&groupBy=day
Authorization: Bearer <access-token>
```

#### Correlations Analysis
```bash
GET /api/analytics/correlations
Authorization: Bearer <access-token>
```

#### Export Data
```bash
# Export as JSON
GET /api/analytics/export?format=json&startDate=2024-01-01

# Export as CSV
GET /api/analytics/export?format=csv&startDate=2024-01-01
```

## 🗄️ Database Schema

### Core Models

- **User** - User accounts and authentication
- **UserProfile** - Extended user information and preferences
- **UserSettings** - App configuration and privacy settings
- **MoodEntry** - Daily mood, energy, stress, sleep tracking
- **JournalEntry** - Private journal entries with AI analysis
- **Activity** - User activities and their mood impact
- **Goal** - Wellness goals and progress tracking
- **Achievement** - Gamification and milestone system
- **Insight** - AI-generated personalized insights

### Crisis Support Models

- **CrisisContact** - Emergency contacts and support numbers
- **EmergencyPlan** - Crisis intervention plans
- **SupportRequest** - Help desk and support tickets

### Analytics Models

- **UserSession** - Session tracking and analytics
- **UserAnalytics** - Daily aggregated user metrics
- **Notification** - Push notifications and alerts
- **Reminder** - Scheduled reminders and check-ins

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- Magic link login for passwordless authentication
- Token expiration and rotation
- User session management

### Data Protection
- Input validation and sanitization
- SQL injection prevention with Prisma
- XSS protection with Helmet
- CORS configuration for frontend integration
- Rate limiting for API abuse prevention

### Privacy Controls
- User-controlled data sharing settings
- Anonymous mode for sensitive data
- Data retention policies
- GDPR compliance features

## 🚀 Deployment

### Environment Setup

1. **Database**: PostgreSQL instance (local, cloud, or Supabase)
2. **Environment Variables**: Configure all required variables
3. **Email Service**: Gmail with app password or SMTP server
4. **OpenAI**: Valid API key with sufficient credits

### Production Checklist

- [ ] Set strong JWT secrets
- [ ] Configure production database
- [ ] Set up email service
- [ ] Configure OpenAI API key
- [ ] Set up monitoring and logging
- [ ] Configure CORS for production frontend
- [ ] Set up SSL/TLS certificates
- [ ] Configure rate limiting
- [ ] Set up backup and recovery

### Deployment Platforms

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Railway
```bash
# Connect to Railway
railway login
railway link

# Deploy
railway up
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=auth.test.js
```

## 📊 Monitoring & Logging

### Health Check
```bash
GET /health
```

Returns API health status, database connectivity, and version information.

### Logging
- Winston logging with different levels (error, warn, info, debug)
- Request/response logging
- Error tracking with stack traces
- Performance monitoring

### Metrics
- API response times
- Database query performance
- Error rates and types
- User engagement metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@mentalhealthtracker.com or create an issue in the repository.

### Crisis Resources
- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **NAMI HelpLine**: 1-800-950-6264

---

<div align="center">

**🧠 Mental Health Tracker API** - Supporting Mental Wellness Through Technology

*Built with ❤️ for mental health awareness and support*

</div> 