'use client';

// Day 8: n8n Webhook Testing Dashboard
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WebhookTest {
  id: string;
  trigger: string;
  timestamp: string;
  status: 'pending' | 'success' | 'error';
  response?: any;
  duration?: number;
}

interface WebhookPayload {
  trigger: string;
  category?: string;
  count?: number;
  delivery_method?: string;
  automation_id?: string;
}

export default function WebhookDashboard() {
  const [tests, setTests] = useState<WebhookTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [customPayload, setCustomPayload] = useState('');

  useEffect(() => {
    // Set the webhook URL based on current domain
    if (typeof window !== 'undefined') {
      setWebhookUrl(`${window.location.origin}/api/webhook/quotes`);
    }
  }, []);

  const testWebhook = async (payload: WebhookPayload) => {
    const testId = `test_${Date.now()}`;
    const newTest: WebhookTest = {
      id: testId,
      trigger: payload.trigger,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    setTests(prev => [newTest, ...prev]);
    setLoading(true);

    try {
      const startTime = Date.now();
      const response = await fetch('/api/webhook/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const duration = Date.now() - startTime;

      setTests(prev => prev.map(test => 
        test.id === testId 
          ? { 
              ...test, 
              status: response.ok ? 'success' : 'error',
              response: result,
              duration
            }
          : test
      ));
    } catch (error) {
      setTests(prev => prev.map(test => 
        test.id === testId 
          ? { 
              ...test, 
              status: 'error',
              response: { error: String(error) }
            }
          : test
      ));
    } finally {
      setLoading(false);
    }
  };

  const quickTests = [
    {
      name: 'Webhook Test',
      payload: { trigger: 'webhook_test', automation_id: 'dashboard_test' }
    },
    {
      name: 'Generate 3 Quotes',
      payload: { trigger: 'generate_quotes', count: 3, category: 'all' }
    },
    {
      name: 'Daily Inspiration',
      payload: { trigger: 'daily_inspiration', automation_id: 'daily_auto' }
    },
    {
      name: 'Category Summary',
      payload: { trigger: 'category_summary' }
    },
    {
      name: 'Motivation Quotes',
      payload: { trigger: 'generate_quotes', category: 'motivation', count: 5, delivery_method: 'formatted' }
    }
  ];

  const handleCustomTest = () => {
    try {
      const payload = JSON.parse(customPayload);
      testWebhook(payload);
    } catch (error) {
      alert('Invalid JSON payload');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🔗 Day 8: n8n Webhook Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Test and monitor webhook integrations for automation workflows
          </p>
        </div>

        <Tabs defaultValue="testing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="testing">Webhook Testing</TabsTrigger>
            <TabsTrigger value="monitor">Activity Monitor</TabsTrigger>
            <TabsTrigger value="documentation">API Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="testing" className="space-y-6">
            {/* Quick Tests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚡ Quick Tests
                  <Badge variant="secondary">Ready to Use</Badge>
                </CardTitle>
                <CardDescription>
                  Pre-configured webhook tests to demonstrate different triggers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {quickTests.map((test) => (
                    <Button
                      key={test.name}
                      variant="outline"
                      className="h-auto p-4 text-left justify-start"
                      onClick={() => testWebhook(test.payload)}
                      disabled={loading}
                    >
                      <div>
                        <div className="font-medium">{test.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Trigger: {test.payload.trigger}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom Test */}
            <Card>
              <CardHeader>
                <CardTitle>🛠️ Custom Webhook Test</CardTitle>
                <CardDescription>
                  Test custom payloads and advanced configurations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Webhook URL</label>
                  <Input
                    value={webhookUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">JSON Payload</label>
                  <textarea
                    className="w-full h-32 p-3 border rounded-md font-mono text-sm resize-y"
                    placeholder={JSON.stringify({
                      trigger: 'generate_quotes',
                      category: 'motivation',
                      count: 3,
                      delivery_method: 'formatted',
                      automation_id: 'custom_test'
                    }, null, 2)}
                    value={customPayload}
                    onChange={(e) => setCustomPayload(e.target.value)}
                  />
                </div>
                <Button onClick={handleCustomTest} disabled={loading || !customPayload}>
                  🚀 Execute Custom Test
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  📊 Webhook Activity
                  <Badge variant="outline">{tests.length} Tests</Badge>
                </CardTitle>
                <CardDescription>
                  Real-time monitoring of webhook requests and responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No webhook tests yet. Try the quick tests above!
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {tests.map((test) => (
                      <div
                        key={test.id}
                        className="p-4 border rounded-lg bg-white dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                test.status === 'success' ? 'default' :
                                test.status === 'error' ? 'destructive' : 'secondary'
                              }
                            >
                              {test.status}
                            </Badge>
                            <span className="font-medium">{test.trigger}</span>
                            {test.duration && (
                              <span className="text-xs text-gray-500">
                                {test.duration}ms
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(test.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        {test.response && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                              View Response
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-x-auto">
                              {JSON.stringify(test.response, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documentation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📚 API Documentation</CardTitle>
                <CardDescription>
                  Complete guide for integrating with n8n workflows
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Endpoint</h3>
                  <code className="bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                    POST /api/webhook/quotes
                  </code>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Available Triggers</h3>
                  <div className="grid gap-3">
                    {[
                      { trigger: 'webhook_test', desc: 'Test webhook connectivity and status' },
                      { trigger: 'generate_quotes', desc: 'Generate random quotes with optional filtering' },
                      { trigger: 'daily_inspiration', desc: 'Get a formatted daily inspiration quote' },
                      { trigger: 'category_summary', desc: 'Get statistics about quote categories' }
                    ].map((item) => (
                      <div key={item.trigger} className="p-3 border rounded-lg">
                        <code className="font-medium">{item.trigger}</code>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">n8n Integration Steps</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Create a new workflow in n8n</li>
                    <li>Add a Webhook node as trigger</li>
                    <li>Set the webhook URL to: <code>{webhookUrl}</code></li>
                    <li>Configure the HTTP method as POST</li>
                    <li>Add your JSON payload with the desired trigger</li>
                    <li>Test and activate your workflow</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 