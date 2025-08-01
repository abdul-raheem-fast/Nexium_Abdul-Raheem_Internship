# 🧠 Mental Health Tracker - AI-Powered Wellness Application

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel)

🎯 **A comprehensive mental health tracking application that leverages AI to provide personalized insights, mood analysis, and wellness recommendations**

✅ **COMPLETED & DEPLOYED**

[**🌟 Live Demo**](https://nexium-muhammad-abdul-raheem-khan-grand-project.vercel.app) | [**📊 Dashboard**](https://nexium-muhammad-abdul-raheem-khan-grand-project.vercel.app/dashboard) | [**🔗 Webhooks**](https://nexium-muhammad-abdul-raheem-khan-grand-project.vercel.app/webhooks)

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

---

## 🏗️ **Architecture & Tech Stack**

### **Frontend**
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context + Local Storage
- **Authentication**: Magic link system with JWT tokens
- **Deployment**: Vercel

### **Backend**
- **Runtime**: Node.js with Express.js
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

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or pnpm
- MongoDB Atlas account
- Supabase account
- OpenAI API key
- Gmail account (for email automation)

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd internship/grand-project
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies  
cd api
npm install
```

3. **Environment Setup**
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend (.env)
PORT=5000
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

4. **Database Setup**
```bash
# Run Prisma migrations
cd api
npx prisma migrate dev
npx prisma generate
```

5. **Start Development Servers**
```bash
# Start backend (in api directory)
npm run dev

# Start frontend (in root directory)
npm run dev
```

---

## 📚 **API Documentation**

### **Authentication Endpoints**

#### **POST /api/auth/magic-link**
Send magic link for passwordless authentication
```json
{
  "email": "user@example.com"
}
```

#### **GET /api/auth/verify?token={magicToken}**
Verify magic link and authenticate user
```json
{
  "success": true,
  "user": { "id", "email", "profile" },
  "accessToken": "jwt_token"
}
```

### **AI Endpoints**

#### **POST /api/ai/analyze-mood**
Analyze mood entry with AI
```json
{
  "moodEntryId": "entry_id",
  "authToken": "jwt_token"
}
```

#### **POST /api/ai/generate-insights**
Generate personalized insights
```json
{
  "authToken": "jwt_token"
}
```

#### **POST /api/ai/recommend-activities**
Get AI-powered activity recommendations
```json
{
  "currentMood": 7,
  "moodType": "GOOD",
  "availableTime": 30,
  "location": "home",
  "energy": 8,
  "authToken": "jwt_token"
}
```

### **Data Endpoints**

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
  "notes": "Feeling productive today",
  "authToken": "jwt_token"
}
```

#### **GET /api/moods**
Get user's mood history
```json
{
  "authToken": "jwt_token"
}
```

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

### **Frontend Deployment (Vercel)**
```bash
# Build and deploy
npm run build
vercel --prod
```

### **Backend Deployment (Vercel)**
```bash
# Deploy API routes
vercel api --prod
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
├── app/                 # Next.js frontend
│   ├── dashboard/       # Dashboard pages
│   ├── mood/           # Mood tracking
│   ├── insights/       # AI insights
│   └── profile/        # User profile
├── api/                # Node.js backend
│   ├── routes/         # API endpoints
│   ├── models/         # Database models
│   └── lib/            # Utilities
├── components/         # Reusable UI components
├── lib/               # Frontend utilities
└── docs/              # Documentation
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