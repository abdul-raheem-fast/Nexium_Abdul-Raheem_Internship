# 🧠 Mental Health Tracker - AI-Powered Wellness Application

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtoken)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel)

🎯 **A comprehensive mental health tracking application that leverages AI to provide personalized insights, mood analysis, and wellness recommendations**

✅ **COMPLETED & DEPLOYED**

[**🌟 Live Demo**](https://nexium-mental-health-tracker.vercel.app/) | [**📊 Dashboard**](https://nexium-mental-health-tracker.vercel.app/dashboard) | [**🔗 Webhooks**](https://nexium-mental-health-tracker.vercel.app/webhooks)

</div>

## 📋 **Project Overview**

A comprehensive mental health tracking application that leverages AI to provide personalized insights, mood analysis, and wellness recommendations. Built with modern full-stack technologies and real-time AI integration.

### **🎯 Key Features**
- **AI-Powered Mood Analysis**: Real-time sentiment analysis using OpenAI GPT-4
- **Personalized Insights**: Machine learning-driven wellness recommendations
- **Secure Authentication**: Magic link authentication system
- **Real-time Tracking**: Mood, activities, and journal entries
- **Crisis Support**: Automated detection and resource recommendations
- **Responsive Design**: Modern UI/UX with dark/light theme support
- **Smart Data Initialization**: Automatic mock data creation for new users

### **📊 Data Management & User Experience**
- **Automatic Mock Data**: New users receive 6 sample mood entries upon first login to demonstrate app functionality
- **Seamless Onboarding**: Users can immediately explore features without starting from scratch
- **Real Data Integration**: New entries are added to existing data, creating a rich history over time
- **Personalized Analytics**: All insights and recommendations are based on user's actual data (mock + real entries)

---

## 🏗️ **Architecture & Tech Stack**

### **Frontend**
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context + Local Storage
- **Authentication**: Magic link system with JWT tokens
- **Deployment**: Vercel

### **Backend**
- **Runtime**: Next.js 15 API Routes (Serverless Functions)
- **Database**: MongoDB (MongoDB Atlas) + Supabase
- **Authentication**: JWT with magic link verification
- **AI Integration**: OpenAI GPT-4 API
- **Email**: Nodemailer with Gmail SMTP
- **Deployment**: Vercel Serverless Functions

### **AI & Machine Learning**
- **OpenAI GPT-4**: Sentiment analysis and insights generation
- **Real-time Processing**: Instant mood and journal analysis
- **Personalized Recommendations**: Context-aware activity suggestions
- **Crisis Detection**: Automated risk assessment algorithms

### **Database Schema**
```sql
-- Users
users: { id, email, profile, settings, createdAt, isActive }

-- Mood Entries  
moodEntries: { id, userId, moodScore, moodType, energy, anxiety, stress, sleep, activities, notes, sentiment, emotions, triggers, createdAt }

-- Journal Entries
journalEntries: { id, userId, title, content, sentiment, emotions, themes, insights, createdAt }

-- Activities
activities: { id, userId, name, category, duration, description, moodImpact, completedAt }

-- Insights
insights: { id, userId, type, title, description, confidence, recommendations, createdAt }
```

### **🔄 User Data Flow & Experience**

#### **New User Onboarding**
1. **First Login**: User authenticates via magic link
2. **Automatic Data Creation**: System creates 6 sample mood entries (6 days ago to 1 day ago)
3. **Immediate Functionality**: User can explore dashboard, analytics, and AI insights
4. **Rich Demo Data**: Sample entries include various moods, activities, and realistic scenarios

#### **Data Management**
- **Mock Data**: Created once per user, never duplicated
- **Real Entries**: New mood entries are added to existing data
- **Combined Analytics**: All calculations use both mock and real data
- **Personalized Insights**: AI recommendations based on user's complete history

#### **Sample Mock Data Includes**
- **Mood Variations**: Good, Okay, Great, with realistic scores (6-9/10)
- **Activities**: Exercise, Meditation, Reading, Social, Work, Hobby
- **Realistic Notes**: Contextual descriptions for each entry
- **Time Distribution**: Spread across 6 days for trend analysis
- **Sleep Data**: Varied sleep hours (6-9 hours) for pattern recognition

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or pnpm
- MongoDB Atlas account
- Supabase account
- OpenAI API key
- Gmail account (for email automation)

### **🔧 Technical Implementation Notes**

#### **Mock Data System**
- **Location**: `app/api/moods/route.ts` - `createMockDataForUser()` function
- **Trigger**: First API call to `/api/moods` when user has no entries
- **Database**: Stored as real MongoDB documents with user's `userId`
- **Persistence**: Mock data remains until manually deleted
- **Integration**: Seamlessly works with all existing features

#### **Data Flow Architecture**
```
New User Login → Check for existing entries → Create mock data → Return combined data
Existing User → Fetch real entries → Return user's actual data
New Entry Creation → Add to existing data → Update analytics → Refresh insights
```

#### **API Endpoints**
- `GET /api/moods` - Fetches user entries (creates mock data if none exist)
- `POST /api/moods` - Creates new mood entry
- `GET /api/analytics/dashboard` - Real-time analytics from user data
- `GET /api/ai/generate-insights` - AI insights based on user's mood history

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd internship/grand-project
```

2. **Install dependencies**
```bash
# Install all dependencies
npm install
```

3. **Environment Setup**
```bash
# Create .env.local file
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
MONGODB_URI=your_mongodb_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
JWT_MAGIC_SECRET=your_magic_link_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
FRONTEND_URL=http://localhost:3000
```

4. **Start Development Server**
```bash
# Start Next.js development server
npm run dev
```

---

## 📚 **API Documentation**

### **Current API Endpoints**

#### **POST /api/auth/magic-link**
Send magic link for passwordless authentication
```json
{
  "email": "user@example.com"
}
```

#### **GET /api/health**
Health check endpoint
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

#### **POST /api/moods**
Create new mood entry
```json
{
  "moodScore": 8,
  "moodType": "GOOD",
  "energy": 7,
  "anxiety": 3,
  "stress": 4,
  "sleep": 7.5,
  "activities": ["work", "exercise"],
  "notes": "Feeling productive today"
}
```

#### **GET /api/moods**
Get mood entries
```json
{
  "success": true,
  "moodEntries": [...]
}
```

### **Architecture Notes**
- **Next.js 15 API Routes**: All endpoints are serverless functions
- **MongoDB Integration**: Direct database connection with Mongoose
- **JWT Authentication**: Magic link system with secure tokens
- **Vercel Deployment**: Optimized for serverless execution

---

## 🧠 **AI Features Deep Dive**

### **Mood Analysis Pipeline**
1. **Data Collection**: User inputs mood score, activities, notes
2. **AI Processing**: OpenAI GPT-4 analyzes sentiment and patterns
3. **Insight Generation**: Personalized recommendations based on analysis
4. **Real-time Response**: Instant feedback and suggestions

### **Sentiment Analysis**
- **Score Range**: -1 (very negative) to 1 (very positive)
- **Emotion Detection**: Identifies specific emotions (anxiety, joy, stress)
- **Pattern Recognition**: Correlates activities, sleep, and mood
- **Trigger Identification**: Detects potential mood influencers

### **Activity Recommendations**
- **Context-Aware**: Considers current mood, energy, time available
- **Evidence-Based**: Uses mental health research for suggestions
- **Personalized**: Adapts to user's history and preferences
- **Progressive**: Escalates support for low moods

### **Crisis Detection**
- **Risk Assessment**: AI-powered crisis risk evaluation
- **Immediate Response**: Automated support resource delivery
- **Professional Guidance**: Recommendations for professional help
- **Safety Protocols**: Emergency contact information

---

## 🎨 **User Interface**

### **Design System**
- **Color Palette**: Accessible, calming mental health-focused colors
- **Typography**: Clear, readable fonts with proper hierarchy
- **Components**: Reusable UI components with shadcn/ui
- **Responsive**: Mobile-first design with tablet and desktop support

### **Key Pages**
- **Dashboard**: Overview of mental health trends and insights
- **Mood Entry**: Intuitive mood tracking interface
- **Journal**: Rich text editor for emotional expression
- **Insights**: AI-generated personalized recommendations
- **Profile**: User settings and preferences

### **Accessibility**
- **WCAG 2.1 AA Compliance**: Screen reader support, keyboard navigation
- **Color Contrast**: High contrast ratios for readability
- **Focus Management**: Clear focus indicators and logical tab order
- **Alternative Text**: Descriptive alt text for all images

---

## 🔒 **Security & Privacy**

### **Data Protection**
- **Encryption**: All data encrypted in transit and at rest
- **Authentication**: Secure JWT-based authentication system
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive input sanitization

### **Privacy Compliance**
- **GDPR Ready**: User data control and deletion capabilities
- **HIPAA Considerations**: Mental health data protection measures
- **Data Minimization**: Only collect necessary information
- **User Consent**: Clear privacy policy and consent mechanisms

### **Security Measures**
- **Rate Limiting**: API endpoint protection
- **CORS Configuration**: Cross-origin request security
- **Environment Variables**: Secure credential management
- **Database Security**: Connection encryption and access controls

---

## 📊 **Performance & Scalability**

### **Frontend Optimization**
- **Code Splitting**: Dynamic imports for faster loading
- **Image Optimization**: Next.js automatic image optimization
- **Caching**: Strategic caching for improved performance
- **Bundle Analysis**: Optimized bundle sizes

### **Backend Performance**
- **Database Indexing**: Optimized queries for fast response
- **Connection Pooling**: Efficient database connections
- **Caching Layer**: Redis caching for frequently accessed data
- **Load Balancing**: Horizontal scaling capabilities

### **Monitoring & Analytics**
- **Error Tracking**: Comprehensive error monitoring
- **Performance Metrics**: Response time and throughput tracking
- **User Analytics**: Usage patterns and feature adoption
- **Health Checks**: Automated system health monitoring

---

## 🚀 **Deployment**

### **Vercel Deployment**
```bash
# Build and deploy
npm run build
vercel --prod
```

### **Environment Variables (Production)**
Set these in your Vercel dashboard:
- `MONGODB_URI`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `JWT_SECRET`
- `JWT_MAGIC_SECRET`
- `EMAIL_USER`
- `EMAIL_APP_PASSWORD`
- `FRONTEND_URL`

### **Architecture Notes**
- **Next.js 15 API Routes**: All backend functionality is now serverless functions
- **Single Deployment**: Frontend and backend deploy together
- **Vercel Optimized**: Built specifically for Vercel's serverless platform

### **Environment Variables (Production)**
Set these in your Vercel dashboard:
- `MONGODB_URI`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `JWT_SECRET`
- `JWT_MAGIC_SECRET`
- `EMAIL_USER`
- `EMAIL_APP_PASSWORD`

---

## 🧪 **Testing**

### **Unit Tests**
```bash
# Run frontend tests
npm test

# Run backend tests
cd api && npm test
```

### **Integration Tests**
```bash
# Test API endpoints
npm run test:integration
```

### **End-to-End Tests**
```bash
# Test complete user flows
npm run test:e2e
```

---

## 📈 **Future Enhancements**

### **Planned Features**
- **Mobile App**: React Native application
- **Wearable Integration**: Apple Health, Google Fit sync
- **Group Therapy**: Community support features
- **Professional Dashboard**: Therapist/psychologist interface
- **Advanced Analytics**: Machine learning insights

### **Technical Improvements**
- **Real-time Updates**: WebSocket integration
- **Offline Support**: Progressive Web App capabilities
- **Voice Input**: Speech-to-text for journal entries
- **Multilingual**: Internationalization support

---

## 👨‍💻 **Developer Information**

### **Project Structure**
```
grand-project/
├── app/                 # Next.js App Router
│   ├── api/            # API Routes (Serverless Functions)
│   │   ├── auth/       # Authentication endpoints
│   │   ├── health/     # Health check
│   │   └── moods/      # Mood tracking API
│   ├── dashboard/      # Dashboard pages
│   ├── mood/          # Mood tracking
│   ├── insights/      # AI insights
│   ├── profile/       # User profile
│   └── auth/          # Authentication pages
├── lib/               # Utilities & Database
│   ├── database.ts    # MongoDB connection
│   └── models.ts      # Mongoose models
├── components/        # Reusable UI components
└── docs/             # Documentation
```

### **Code Quality**
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **TypeScript**: Type safety and better development experience
- **Git Hooks**: Pre-commit code quality checks

---

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### **Code Standards**
- Follow ESLint configuration
- Write meaningful commit messages
- Add JSDoc comments for functions
- Maintain test coverage above 80%

---

## 🤝 **Connect & Collaborate**

- **LinkedIn:** [Muhammad Abdul Raheem Khan](https://www.linkedin.com/in/abdul-raheem-fast)
- **GitHub:** [@abdul-raheem-fast](https://github.com/abdul-raheem-fast)
- **Email:** abdulraheemghauri@gmail.com

---

## 📄 **License**

This project is developed as part of the Nexium Full Stack Development Internship Program.

---

## 🙏 **Acknowledgments**

- **OpenAI**: For providing the GPT-4 API
- **Vercel**: For hosting and deployment platform
- **MongoDB**: For database services
- **Supabase**: For additional database features
- **shadcn/ui**: For beautiful UI components
- **Nexium**: For the internship opportunity

---

**Built with ❤️ for mental health awareness and support** 