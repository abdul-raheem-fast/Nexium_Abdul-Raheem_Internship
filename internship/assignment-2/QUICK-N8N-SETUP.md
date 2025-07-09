# 🚀 Quick n8n Setup Guide
## Import & Run Your Workflows in 5 Minutes

### 🎯 Your n8n Instance
**URL**: `https://abdulraheem-cs.app.n8n.cloud/home/workflows`

---

## 📥 Step 1: Import Daily Quote Workflow

### 1.1 Open Your n8n Dashboard
- Go to: `https://abdulraheem-cs.app.n8n.cloud/home/workflows`
- You should see the "Welcome Abdul!" screen

### 1.2 Create New Workflow
1. Click the **"Create Workflow"** button (orange button in top right)
2. Select **"Import from JSON"** option

### 1.3 Copy the Daily Quote Workflow
```json
{
  "name": "Daily Quote Automation - Nexium",
  "nodes": [
    {
      "parameters": {
        "rule": "0 9 * * *",
        "timezone": "Asia/Karachi"
      },
      "id": "cron-trigger",
      "name": "Daily 9AM Trigger",
      "type": "n8n-nodes-base.cron",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://nexium-muhammad-abdul-raheem-khan-assign2.vercel.app/api/webhook/quotes",
        "options": {
          "headers": {
            "Content-Type": "application/json"
          },
          "body": {
            "trigger": "daily_inspiration",
            "category": "motivation",
            "count": 1
          }
        }
      },
      "id": "webhook-request",
      "name": "Get Daily Quote",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [460, 300]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "leftValue": "={{ $json.success }}",
            "operation": "equal",
            "rightValue": true
          }
        }
      },
      "id": "success-check",
      "name": "Check Success",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [680, 300]
    }
  ],
  "connections": {
    "Daily 9AM Trigger": {
      "main": [
        [
          {
            "node": "Get Daily Quote",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get Daily Quote": {
      "main": [
        [
          {
            "node": "Check Success",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

### 1.4 Import the Workflow
1. **Copy the entire JSON above** (Ctrl+A, Ctrl+C)
2. **Paste it** into the import box in n8n
3. Click **"Import"**
4. The workflow will appear with 3 connected nodes

### 1.5 Test the Workflow
1. Click **"Execute Workflow"** button (play icon)
2. Watch the nodes execute one by one
3. Check the output - you should see a quote generated!

### 1.6 Activate Daily Automation
1. Click the **toggle switch** at the top (to turn workflow "Active")
2. The workflow will now run daily at 9 AM Pakistan time

---

## 📥 Step 2: Import Smart Quote Generator

### 2.1 Create Second Workflow
1. Go back to workflows list
2. Click **"Create Workflow"** again
3. Select **"Import from JSON"**

### 2.2 Copy the Smart Generator Workflow
```json
{
  "name": "Smart Quote Generator - Nexium",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "quote-request",
        "options": {
          "noResponseBody": false
        }
      },
      "id": "webhook-trigger",
      "name": "Quote Request Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300],
      "webhookId": "nexium-quote-generator"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://nexium-muhammad-abdul-raheem-khan-assign2.vercel.app/api/webhook/quotes",
        "options": {
          "headers": {
            "Content-Type": "application/json"
          },
          "body": {
            "trigger": "generate_quotes",
            "category": "={{ $json.body.category || 'motivation' }}",
            "count": "={{ $json.body.count || 3 }}"
          }
        }
      },
      "id": "generate-quotes",
      "name": "Generate Quotes",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [460, 300]
    }
  ],
  "connections": {
    "Quote Request Webhook": {
      "main": [
        [
          {
            "node": "Generate Quotes",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

### 2.3 Import and Get Webhook URL
1. **Paste the JSON** and click **"Import"**
2. **Activate** the workflow (toggle switch)
3. Click on the **"Quote Request Webhook"** node
4. **Copy the webhook URL** that appears (something like: `https://abdulraheem-cs.app.n8n.cloud/webhook/quote-request`)

---

## 🧪 Step 3: Test Your Workflows

### Test Daily Quote (Manual)
1. In the **"Daily Quote Automation"** workflow
2. Click **"Execute Workflow"**
3. Watch it fetch a quote from your API
4. Check the output data

### Test Smart Generator (via Webhook)
```bash
# Use this command in your terminal (replace with your actual webhook URL)
curl -X POST "https://abdulraheem-cs.app.n8n.cloud/webhook/quote-request" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "success",
    "count": 2
  }'
```

### Test via Your Dashboard
1. Go to: `https://nexium-muhammad-abdul-raheem-khan-assign2.vercel.app/webhooks`
2. Use the **"Quick Tests"** section
3. Watch real-time webhook activity

---

## 🎯 What Each Workflow Does

### Daily Quote Automation
- **Triggers**: Every day at 9 AM Pakistan time
- **Action**: Fetches one motivational quote
- **Result**: Can be extended to send to Slack/Discord/Email

### Smart Quote Generator  
- **Triggers**: When external system sends webhook request
- **Action**: Generates quotes based on request parameters
- **Result**: Returns formatted quote response

---

## 🔧 Customize Your Workflows

### Change Daily Time
1. Edit **"Daily 9AM Trigger"** node
2. Change **rule**: `"0 18 * * *"` (for 6 PM)
3. Save and reactivate

### Change Quote Category
1. Edit **"Get Daily Quote"** node  
2. Change **category**: `"wisdom"` instead of `"motivation"`
3. Save workflow

### Add More Quotes
1. Edit **count**: `3` instead of `1`
2. Get multiple quotes per request

---

## 📊 Monitor Your Workflows

### In n8n Dashboard
1. Go to **"Executions"** tab
2. See all workflow runs
3. Check success/failure status
4. View execution logs

### In Your App Dashboard
1. Visit: `https://nexium-muhammad-abdul-raheem-khan-assign2.vercel.app/webhooks`
2. Monitor real-time webhook calls
3. Check API performance

---

## 🚨 Troubleshooting

### Workflow Not Running
- ✅ Check if workflow is **"Active"** (toggle switch on)
- ✅ Verify the cron expression is correct
- ✅ Check execution logs for errors

### Webhook Not Working
- ✅ Make sure webhook workflow is **"Active"**
- ✅ Test the webhook URL with curl command
- ✅ Check your Vercel app is deployed and working

### API Errors
- ✅ Test your webhook API directly: `https://nexium-muhammad-abdul-raheem-khan-assign2.vercel.app/webhooks`
- ✅ Check if your app is deployed on Vercel
- ✅ Verify environment variables are set

---

## ✅ Quick Checklist

- [ ] Import Daily Quote workflow ✅
- [ ] Import Smart Quote Generator ✅  
- [ ] Activate both workflows ✅
- [ ] Test manual execution ✅
- [ ] Get webhook URL from smart generator ✅
- [ ] Test webhook with curl command ✅
- [ ] Check executions tab for logs ✅

---

## 🎉 You're Ready!

Once both workflows are imported and active:

1. **Daily quotes** will be generated automatically at 9 AM
2. **External systems** can trigger quotes via webhook URL
3. **Monitor everything** through n8n executions and your webhook dashboard
4. **Customize** categories, timing, and output as needed

**🚀 Your n8n automation system is now live!** 