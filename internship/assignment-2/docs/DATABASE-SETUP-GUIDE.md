# 🔧 Database & n8n Setup Guide
## Complete Configuration for Nexium Assignment 2

### 📋 Quick Setup Checklist

#### ✅ Required Services
- [ ] Supabase Project (PostgreSQL)
- [ ] MongoDB Atlas Cluster
- [ ] n8n Instance (Cloud or Self-hosted)
- [ ] Vercel Deployment
- [ ] Discord/Slack Webhooks (Optional)

---

### 🗄️ Database Configuration

#### 1. Supabase Setup

**Step 1: Get Supabase Credentials**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `nexium-pg`
3. Navigate to: Settings → API
4. Copy these values:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Step 2: Create Summaries Table**
```sql
-- Run this in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS summaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT,
    summary TEXT,
    urdu_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_summaries_url ON summaries(url);
CREATE INDEX IF NOT EXISTS idx_summaries_created_at ON summaries(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public access (adjust as needed)
CREATE POLICY "Allow public access" ON summaries
    FOR ALL USING (true);
```

#### 2. MongoDB Atlas Setup

**Step 1: Get MongoDB Connection String**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Select your cluster: `Cluster0`
3. Click "Connect" → "Connect your application"
4. Copy the connection string:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/nexium_assignment2?retryWrites=true&w=majority
```

**Step 2: Network Access Configuration**
1. In MongoDB Atlas, go to Network Access
2. Add IP Address: `0.0.0.0/0` (for Vercel deployments)
3. Or add specific Vercel IP ranges for better security

**Step 3: Database User Setup**
1. Go to Database Access
2. Create a new user or use existing
3. Grant `readWrite` permissions to `nexium_assignment2` database

---

### 🔗 n8n Integration Setup

#### 1. Your n8n Instance
**URL**: `https://abdulraheem-cs.app.n8n.cloud/home/workflows`

#### 2. Import Workflows

**Step 1: Import Daily Quote Workflow**
1. In n8n, click "Create Workflow" → "Import from JSON"
2. Copy the content from: `n8n-workflows/daily-quote-workflow.json`
3. Paste and import

**Step 2: Import Smart Quote Generator**
1. Click "Create Workflow" → "Import from JSON"
2. Copy the content from: `n8n-workflows/smart-quote-generator.json`
3. Paste and import

#### 3. Configure Webhook URLs

**For Daily Quote Workflow:**
- No webhook trigger needed (uses Cron)
- HTTP Request URL: `https://nexium-muhammad-abdul-raheem-khan-assign2.vercel.app/api/webhook/quotes`

**For Smart Quote Generator:**
- Webhook URL will be generated automatically
- Copy the webhook URL from n8n and use it for external integrations

#### 4. Set Up Notifications (Optional)

**Slack Integration:**
1. Create a Slack app and incoming webhook
2. Replace `YOUR/SLACK/WEBHOOK` in the workflow
3. Test the connection

**Discord Integration:**
1. Create a Discord webhook in your server
2. Replace `YOUR/DISCORD/WEBHOOK` in the workflow
3. Test the connection

---

### 🚀 Vercel Deployment Configuration

#### 1. Environment Variables Setup
In your Vercel dashboard, add these environment variables:

```bash
# Database
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/nexium_assignment2

# Security
WEBHOOK_SECRET=your-secure-secret-key

# Optional Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK

# Application
NEXT_PUBLIC_APP_URL=https://nexium-muhammad-abdul-raheem-khan-assign2.vercel.app
```

#### 2. Deploy from Repository
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Deploy!

---

### 🧪 Testing Your Setup

#### 1. Test Database Connections

**Test Supabase:**
```bash
curl -X POST https://your-app.vercel.app/api/test-db \
  -H "Content-Type: application/json" \
  -d '{"test": "supabase"}'
```

**Test MongoDB:**
```bash
curl -X POST https://your-app.vercel.app/api/test-db \
  -H "Content-Type: application/json" \
  -d '{"test": "mongodb"}'
```

#### 2. Test Webhook Endpoints

**Test Quote Generation:**
```bash
curl -X POST https://your-app.vercel.app/api/webhook/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "trigger": "generate_quotes",
    "category": "motivation",
    "count": 2
  }'
```

**Test Blog Summarization:**
```bash
curl -X POST https://your-app.vercel.app/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/blog-post"
  }'
```

#### 3. Test n8n Workflows

**Test via Webhook Dashboard:**
1. Go to: `https://your-app.vercel.app/webhooks`
2. Use the "Quick Tests" section
3. Monitor responses in real-time

**Test via n8n Interface:**
1. Open your workflow in n8n
2. Click "Execute Workflow"
3. Check the execution log

---

### 🔐 Security Configuration

#### 1. Network Security
- **Supabase**: Enable RLS policies
- **MongoDB**: Restrict IP access to Vercel ranges
- **n8n**: Use webhook authentication

#### 2. API Security
```javascript
// Add to your webhook endpoints
const isValidRequest = (req) => {
  const authHeader = req.headers.authorization;
  const expectedSecret = process.env.WEBHOOK_SECRET;
  return authHeader === `Bearer ${expectedSecret}`;
};
```

#### 3. Environment Protection
- Never commit `.env` files
- Use Vercel environment variables
- Rotate credentials regularly

---

### 📊 Monitoring & Analytics

#### 1. Check Application Health
- **Homepage**: `https://your-app.vercel.app`
- **Webhook Dashboard**: `https://your-app.vercel.app/webhooks`
- **Vercel Analytics**: Check deployment logs

#### 2. Database Monitoring
- **Supabase**: Check usage in dashboard
- **MongoDB**: Monitor connections in Atlas

#### 3. n8n Workflow Monitoring
- Check execution history
- Set up error notifications
- Monitor webhook response times

---

### 🔧 Troubleshooting

#### Common Issues:

**1. Database Connection Fails**
- Verify environment variables
- Check network access rules
- Validate connection strings

**2. Webhook Not Triggering**
- Check n8n workflow is active
- Verify webhook URL is correct
- Test with curl commands

**3. CORS Errors**
- Check API route headers
- Verify origin settings
- Test from different domains

**4. Rate Limiting**
- Implement delays in n8n workflows
- Monitor API usage
- Add retry logic

---

### 📞 Support

If you encounter issues:
1. Check the webhook dashboard logs
2. Review Vercel deployment logs
3. Test individual components
4. Use the comprehensive test suite: `node verify-webhooks.js`

---

**🎯 Ready to Go!**

Once configured, you'll have:
- ✅ Automated daily quote delivery
- ✅ Smart quote generation via webhooks
- ✅ Blog summarization with database storage
- ✅ Real-time monitoring dashboard
- ✅ Complete n8n automation workflows 