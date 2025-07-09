// Day 8: n8n Webhook Integration - Quote Automation
import { NextRequest, NextResponse } from 'next/server';
import { quotes, getRandomQuotes, getCategoryById } from '@/data/quotes';

interface WebhookPayload {
  trigger: string;
  category?: string;
  count?: number;
  delivery_method?: 'json' | 'formatted' | 'email';
  recipient?: string;
  automation_id?: string;
}

interface WebhookResponse {
  success: boolean;
  message: string;
  data?: any;
  timestamp: string;
  automation_id?: string;
}

export async function POST(request: NextRequest) {
  try {
    const payload: WebhookPayload = await request.json();
    
    const response: WebhookResponse = {
      success: true,
      message: '',
      timestamp: new Date().toISOString(),
      automation_id: payload.automation_id || `auto_${Date.now()}`
    };

    switch (payload.trigger) {
      case 'generate_quotes':
        const count = payload.count || 3;
        const category = payload.category || 'all';
        
        const selectedQuotes = category === 'all' 
          ? getRandomQuotes(count)
          : getRandomQuotes(count, category);

        if (payload.delivery_method === 'formatted') {
          response.data = {
            quotes: selectedQuotes.map(quote => ({
              text: `"${quote.text}" - ${quote.author}`,
              category: getCategoryById(quote.category)?.name || quote.category,
              formatted: true
            })),
            category: category === 'all' ? 'Mixed Categories' : getCategoryById(category)?.name,
            total_count: selectedQuotes.length
          };
        } else {
          response.data = {
            quotes: selectedQuotes,
            metadata: {
              category,
              total_available: category === 'all' ? quotes.length : quotes.filter(q => q.category === category).length,
              generated_count: selectedQuotes.length
            }
          };
        }
        
        response.message = `Successfully generated ${selectedQuotes.length} quotes`;
        break;

      case 'daily_inspiration':
        const dailyQuote = getRandomQuotes(1)[0];
        response.data = {
          quote: {
            text: dailyQuote.text,
            author: dailyQuote.author,
            category: getCategoryById(dailyQuote.category)?.name,
            tags: dailyQuote.tags
          },
          formatted_message: `🌟 Daily Inspiration 🌟\n\n"${dailyQuote.text}"\n\n— ${dailyQuote.author}\n\nCategory: ${getCategoryById(dailyQuote.category)?.name}\n\n#DailyInspiration #Motivation`,
          delivery_ready: true
        };
        response.message = 'Daily inspiration quote generated';
        break;

      case 'category_summary':
        const categoryStats = quotes.reduce((acc, quote) => {
          acc[quote.category] = (acc[quote.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        response.data = {
          total_quotes: quotes.length,
          categories: Object.keys(categoryStats).map(catId => ({
            id: catId,
            name: getCategoryById(catId)?.name || catId,
            count: categoryStats[catId],
            sample_quote: quotes.find(q => q.category === catId)?.text.substring(0, 100) + '...'
          })),
          most_popular_category: Object.entries(categoryStats).sort(([,a], [,b]) => b - a)[0]
        };
        response.message = 'Quote collection summary generated';
        break;

      case 'webhook_test':
        response.data = {
          webhook_status: 'active',
          available_triggers: [
            'generate_quotes',
            'daily_inspiration', 
            'category_summary',
            'webhook_test'
          ],
          server_time: new Date().toISOString(),
          integration_ready: true
        };
        response.message = 'Webhook test successful - n8n integration active';
        break;

      default:
        response.success = false;
        response.message = `Unknown trigger: ${payload.trigger}`;
        response.data = {
          error: 'Invalid trigger',
          available_triggers: ['generate_quotes', 'daily_inspiration', 'category_summary', 'webhook_test']
        };
    }

    // Log webhook activity (in production, this would go to a database)
    console.log('Webhook Activity:', {
      trigger: payload.trigger,
      timestamp: response.timestamp,
      automation_id: response.automation_id,
      success: response.success
    });

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Webhook Error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Webhook processing failed',
      error: String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// GET endpoint for webhook testing and documentation
export async function GET() {
  return NextResponse.json({
    webhook_info: {
      name: 'Nexium Quote Generator Webhook',
      version: '1.0.0',
      day: 8,
      description: 'n8n integration for automated quote generation and delivery',
      endpoints: {
        POST: '/api/webhook/quotes - Main webhook endpoint',
        GET: '/api/webhook/quotes - This documentation'
      },
      available_triggers: [
        {
          trigger: 'generate_quotes',
          description: 'Generate random quotes',
          parameters: ['category (optional)', 'count (optional)', 'delivery_method (optional)']
        },
        {
          trigger: 'daily_inspiration',
          description: 'Get formatted daily inspiration quote',
          parameters: []
        },
        {
          trigger: 'category_summary',
          description: 'Get statistics about quote categories',
          parameters: []
        },
        {
          trigger: 'webhook_test',
          description: 'Test webhook connectivity',
          parameters: []
        }
      ],
      example_payload: {
        trigger: 'generate_quotes',
        category: 'motivation',
        count: 5,
        delivery_method: 'formatted',
        automation_id: 'n8n_workflow_123'
      }
    },
    timestamp: new Date().toISOString()
  });
} 