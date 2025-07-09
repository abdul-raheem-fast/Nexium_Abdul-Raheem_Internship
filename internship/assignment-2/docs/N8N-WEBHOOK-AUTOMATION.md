# n8n Webhook Automation System
## Complete Integration Guide for Quote Generator

### Overview
This guide demonstrates how to create automated workflows using n8n that integrate with our Quote Generator webhook system. The system provides multiple automation triggers for quote delivery, daily inspiration, and content management.

### Available Webhook Endpoints

#### Primary Webhook: `/api/webhook/quotes`
**URL**: `https://your-deployment-url.vercel.app/api/webhook/quotes`

**Supported Triggers**:
- `webhook_test` - Basic connectivity test
- `generate_quotes` - Generate quotes by category
- `daily_inspiration` - Get daily inspirational content
- `category_summary` - Get category-based quote summaries

### n8n Workflow Examples

#### 1. Daily Quote Automation
**Workflow Name**: "Daily Inspiration Sender"

**Nodes Configuration**:

1. **Cron Trigger Node**
   ```json
   {
     "rule": "0 9 * * *",
     "timezone": "America/New_York"
   }
   ```

2. **HTTP Request Node**
   ```json
   {
     "method": "POST",
     "url": "https://your-app.vercel.app/api/webhook/quotes",
     "headers": {
       "Content-Type": "application/json",
       "Authorization": "Bearer your-webhook-secret"
     },
     "body": {
       "trigger": "daily_inspiration",
       "category": "motivation",
       "count": 1
     }
   }
   ```

3. **Email Node** (Optional)
   ```json
   {
     "to": "user@example.com",
     "subject": "Your Daily Inspiration 🌟",
     "text": "{{ $json.data.quotes[0].text }} - {{ $json.data.quotes[0].author }}"
   }
   ```

#### 2. Category-Based Quote Generator
**Workflow Name**: "Smart Quote Delivery"

**Trigger Options**:
- Webhook trigger from external systems
- Manual trigger for on-demand generation
- Schedule trigger for regular delivery

**HTTP Request Configuration**:
```json
{
  "method": "POST",
  "url": "https://your-app.vercel.app/api/webhook/quotes",
  "body": {
    "trigger": "generate_quotes",
    "category": "{{ $json.category }}",
    "count": "{{ $json.count || 3 }}",
    "format": "detailed"
  }
}
```

#### 3. Multi-Category Summary Automation
**Workflow Name**: "Weekly Quote Summary"

**Schedule**: Every Sunday at 8 AM

**Multiple HTTP Requests** (parallel execution):
```json
[
  {
    "trigger": "category_summary",
    "category": "motivation"
  },
  {
    "trigger": "category_summary", 
    "category": "success"
  },
  {
    "trigger": "category_summary",
    "category": "wisdom"
  }
]
```

### Advanced Automation Scenarios

#### 4. Conditional Quote Delivery
**Use Case**: Send different quotes based on user preferences or external data

**Workflow Steps**:
1. **Webhook Trigger** - Receive user request
2. **Switch Node** - Route based on user category preference
3. **Multiple HTTP Requests** - Generate category-specific quotes
4. **Merge Node** - Combine results
5. **Response Node** - Send formatted output

#### 5. Blog Integration Automation
**Workflow Name**: "Blog Summary + Quote Enhancement"

**Flow**:
1. **Webhook Trigger** - Blog URL received
2. **HTTP Request to Summarize API**:
   ```json
   {
     "method": "POST",
     "url": "https://your-app.vercel.app/api/summarize",
     "body": {
       "url": "{{ $json.blogUrl }}"
     }
   }
   ```
3. **Conditional Logic** - If summary successful
4. **HTTP Request to Quote API** - Generate related quotes
5. **Format Output** - Combine summary + quotes
6. **Multiple Outputs** - Email, Slack, Database storage

### Testing Your n8n Workflows

#### Using the Webhook Dashboard
1. Navigate to `https://your-app.vercel.app/webhooks`
2. Use the "Quick Tests" section for immediate testing
3. Monitor real-time webhook calls in the "Webhook Monitor"
4. Test custom payloads with the "Custom Payload" form

#### Manual Testing with n8n
1. **Test Node**: Use n8n's test functionality on each node
2. **Execute Workflow**: Run full workflow with sample data
3. **Debug Mode**: Enable to see data flow between nodes
4. **Error Handling**: Add error nodes for production workflows

### Production Deployment

#### Environment Variables
```bash
# In your deployment environment
WEBHOOK_SECRET=your-secure-secret-key
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-key
MONGODB_URI=your-mongodb-connection-string
```

#### Security Best Practices
1. **Authentication**: Always use webhook secrets
2. **Rate Limiting**: Implement in your webhook endpoints
3. **Input Validation**: Validate all incoming webhook data
4. **Logging**: Monitor webhook usage and errors
5. **HTTPS Only**: Never use HTTP for webhook URLs

#### Monitoring and Analytics
```javascript
// Example webhook usage tracking
{
  "timestamp": "2024-01-15T09:00:00Z",
  "trigger": "daily_inspiration",
  "category": "motivation",
  "quotes_generated": 1,
  "response_time": "45ms",
  "source": "n8n-workflow"
}
```

### Example n8n Workflow JSON

#### Daily Inspiration Workflow
```json
{
  "name": "Daily Quote Inspiration",
  "nodes": [
    {
      "parameters": {
        "rule": "0 9 * * *"
      },
      "name": "Daily Trigger",
      "type": "n8n-nodes-base.cron",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "httpMethod": "POST",
        "url": "https://your-app.vercel.app/api/webhook/quotes",
        "options": {
          "headers": {
            "Content-Type": "application/json"
          },
          "body": {
            "trigger": "daily_inspiration",
            "category": "motivation"
          }
        }
      },
      "name": "Generate Quote",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [460, 300]
    }
  ],
  "connections": {
    "Daily Trigger": {
      "main": [
        [
          {
            "node": "Generate Quote",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

### Troubleshooting

#### Common Issues
1. **CORS Errors**: Ensure proper headers in webhook responses
2. **Timeout Issues**: Increase timeout in n8n HTTP request nodes
3. **Authentication Failures**: Verify webhook secrets and headers
4. **Rate Limiting**: Implement delays between requests

#### Debug Steps
1. Check webhook dashboard for incoming requests
2. Verify n8n execution logs
3. Test endpoints manually with curl or Postman
4. Review server logs for errors

### Integration Benefits

#### Business Value
- **Automated Content Delivery**: Reduce manual quote management
- **Personalized Experiences**: Category-based quote generation
- **Multi-Channel Distribution**: Email, Slack, social media integration
- **Analytics and Insights**: Track quote engagement and preferences
- **Scalable Architecture**: Handle multiple automation workflows

#### Technical Advantages
- **Webhook-First Design**: Easy integration with any system
- **RESTful API**: Standard HTTP interface
- **JSON Responses**: Easy data parsing and manipulation
- **Error Handling**: Graceful failure management
- **Real-time Processing**: Immediate response to triggers

---

**Next Steps**:
1. Import workflow JSON into your n8n instance
2. Configure your webhook URLs and secrets
3. Test with the provided dashboard
4. Monitor and optimize based on usage patterns
5. Expand with additional automation scenarios

For support or questions, refer to the webhook dashboard documentation at `/webhooks` on your deployment. 