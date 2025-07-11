# 🚀 Deployment Guide - Nexium Assignment 2

## Muhammad Abdul Raheem Khan - Day 11 Complete

This guide will help you deploy the **Blog Summarizer & Webhook System** to production.

---

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Supabase account
- MongoDB Atlas account
- Vercel account (recommended) or any hosting platform

---

## 🗄️ Database Setup

### Supabase (PostgreSQL)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run this schema:

```sql
-- Blog summaries table
CREATE TABLE blog_summaries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  url text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text NOT NULL,
  urdu_summary text NOT NULL,
  word_count integer NOT NULL DEFAULT 0,
  reading_time text NOT NULL DEFAULT '0 min read',
  source_domain text NOT NULL,
  processed_at timestamp DEFAULT now(),
  content_hash text NOT NULL,
  created_at timestamp DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_blog_summaries_url ON blog_summaries(url);
CREATE INDEX idx_blog_summaries_domain ON blog_summaries(source_domain);
CREATE INDEX idx_blog_summaries_created_at ON blog_summaries(created_at);

-- Enable Row Level Security (recommended)
ALTER TABLE blog_summaries ENABLE ROW LEVEL SECURITY;

-- Allow public read/write (adjust based on your needs)
CREATE POLICY "Allow public access" ON blog_summaries FOR ALL USING (true);
```

3. Get your credentials from **Settings > API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### MongoDB Atlas

1. Create a cluster at [mongodb.com](https://cloud.mongodb.com)
2. Create a database called `nexium-internship`
3. Get your connection string:
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/nexium-internship`

---

## 🔧 Environment Variables

Create `.env.local` file with these variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexium-internship

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production

# Optional: Security
WEBHOOK_SECRET=your-webhook-secret
JWT_SECRET=your-jwt-secret-here
CORS_ORIGINS=https://yourdomain.com

# Optional: Features
ENABLE_ANALYTICS=true
ENABLE_RATE_LIMITING=true
RATE_LIMIT_REQUESTS_PER_MINUTE=100
```

---

## 🌐 Deploy to Vercel (Recommended)

### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables:**
   - In Vercel dashboard, go to **Settings > Environment Variables**
   - Add all the variables from your `.env.local`

4. **Deploy:**
   - Vercel will automatically deploy on every push
   - Your app will be available at `https://your-app.vercel.app`

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add MONGODB_URI
# ... add all other variables

# Deploy to production
vercel --prod
```

---

## 🐳 Deploy with Docker (Alternative)

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
```

```bash
# Build and run
docker build -t nexium-assignment2 .
docker run -p 3000:3000 --env-file .env.local nexium-assignment2
```

---

## 🔧 Local Development Setup

```bash
# Clone and install
git clone <your-repo>
cd internship/assignment-2
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
pnpm dev

# Open browser
open http://localhost:3000
```

---

## 📊 Features Deployed

### ✅ Core Features
- **Blog Summarization**: AI-powered content extraction and summarization
- **Urdu Translation**: 500+ word dictionary for translation
- **Dual Database Storage**: Supabase + MongoDB integration
- **Advanced Webhook System**: n8n integration with 5 triggers
- **Real-time Analytics**: Comprehensive system monitoring
- **Performance Optimization**: Caching, rate limiting, error handling

### ✅ Advanced Features
- **Smart Recommendations**: Time-based quote suggestions
- **Multiple Output Formats**: JSON, formatted, social media ready
- **Rate Limiting**: 100 requests/minute with intelligent throttling
- **Error Recovery**: Graceful degradation and comprehensive logging
- **Live Monitoring**: Real-time system health and performance metrics
- **Security**: CORS, input validation, and secure headers

---

## 🧪 Testing Your Deployment

### 1. Health Check
```bash
curl https://yourdomain.com/api/analytics
```

### 2. Blog Summarization
```bash
curl -X POST https://yourdomain.com/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/blog-post"}'
```

### 3. Webhook Testing
```bash
curl -X POST https://yourdomain.com/api/webhook/quotes \
  -H "Content-Type: application/json" \
  -d '{"trigger":"webhook_test","automation_id":"test_001"}'
```

### 4. Analytics Dashboard
Visit: `https://yourdomain.com/analytics`

---

## 📈 Performance Monitoring

### Built-in Analytics
- **Real-time Metrics**: `/analytics`
- **API Documentation**: `/api/webhook/quotes` (GET)
- **Health Checks**: `/api/analytics` (HEAD)

### Key Metrics Tracked
- Response times (P50, P95, P99)
- Success rates and error patterns
- Database performance
- Cache hit rates
- User activity patterns

---

## 🔒 Security Features

### Implemented
- ✅ Rate limiting (100 req/min)
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Error message sanitization
- ✅ Request logging and monitoring
- ✅ SQL injection prevention
- ✅ XSS protection

### Recommended Additions
- [ ] API key authentication
- [ ] IP whitelisting for webhooks
- [ ] SSL certificate (auto with Vercel)
- [ ] WAF (Web Application Firewall)

---

## 🔧 Maintenance

### Regular Tasks
- Monitor analytics dashboard
- Review error logs
- Update dependencies
- Backup databases
- Performance optimization

### Scaling Considerations
- Add Redis for caching
- Implement CDN for static assets
- Database read replicas
- Load balancing
- Microservices architecture

---

## 📞 Support & Documentation

### API Endpoints
- `POST /api/summarize` - Blog summarization
- `POST /api/webhook/quotes` - Webhook triggers
- `GET /api/analytics` - System analytics
- `GET /analytics` - Analytics dashboard
- `GET /webhooks` - Webhook testing interface

### Integration Examples
- **n8n Workflows**: Check `/docs/N8N-WEBHOOK-AUTOMATION.md`
- **API Examples**: Available in webhook dashboard
- **Testing Suite**: Built-in testing interface

---

## 🏆 Achievement Summary

**Day 11 Complete - Production Ready System**

- ✅ Advanced blog summarization with caching
- ✅ Comprehensive Urdu translation system
- ✅ Dual database architecture (Supabase + MongoDB)
- ✅ Enterprise-grade webhook system
- ✅ Real-time analytics and monitoring
- ✅ Production deployment configuration
- ✅ Security and performance optimization
- ✅ Professional UI/UX design
- ✅ Comprehensive documentation

**Tech Stack:**
- Next.js 15 + TypeScript
- Supabase (PostgreSQL)
- MongoDB Atlas
- Tailwind CSS + ShadCN UI
- Vercel Deployment
- Advanced Analytics

---

**Built with ❤️ by Abdul Raheem Khan**  
**Nexium Internship Program - Assignment 2**  
**Ready for Production Deployment** 🚀 