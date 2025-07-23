'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

interface SummaryResult {
  english: string;
  metadata: {
    title: string;
    wordCount: number;
    readingTime: string;
    source: string;
  };
}

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to process the blog URL');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-blue-950 dark:via-gray-900 dark:to-green-950">
        <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
          Advanced Blog Summarizer
          </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Professional blog content extraction, AI-powered summarization, and enterprise analytics platform
        </p>
        
        <div className="flex justify-center space-x-4 mt-6">
          <Badge variant="outline" className="px-4 py-2">🔍 Smart Scraping</Badge>
          <Badge variant="outline" className="px-4 py-2">🤖 AI Summarization</Badge>
          <Badge variant="outline" className="px-4 py-2">📊 Real-time Analytics</Badge>
          <Badge variant="outline" className="px-4 py-2">🔗 Webhook Integration</Badge>
          </div>
          
        <div className="flex justify-center space-x-6 mt-8">
          <Link href="/analytics" className="text-blue-600 hover:text-blue-800 font-medium">
            📊 View Analytics Dashboard
            </Link>
          <Link href="/webhooks" className="text-green-600 hover:text-green-800 font-medium">
            🔗 Webhook Integration
            </Link>
          </div>
        </div>

      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="blog-summarizer" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blog-summarizer">📝 Blog Summarizer</TabsTrigger>
            <TabsTrigger value="webhook-integration">🔗 Webhook Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="blog-summarizer" className="space-y-8">
            {/* Blog Summarizer Interface */}
            <Card className="mx-auto max-w-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Blog URL Summarizer</CardTitle>
                <CardDescription>
                  Enter a blog URL to automatically extract and summarize content with AI-powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="url"
                      placeholder="https://example.com/blog-post"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Processing...' : 'Summarize Blog'}
                  </Button>
                </form>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Process Steps */}
            <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
              {[
                { step: 1, title: 'Extract', desc: 'Scrape blog content using Cheerio', icon: '🔍' },
                { step: 2, title: 'Summarize', desc: 'Generate AI-style summary with advanced algorithms', icon: '🤖' },
                { step: 3, title: 'Store', desc: 'Save to Supabase & MongoDB databases', icon: '💾' }
              ].map((item) => (
                <Card key={item.step} className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h3 className="font-semibold mb-1">{item.step}. {item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Results */}
            {result && (
              <div className="max-w-4xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      📝 Smart Summary
                    </CardTitle>
                    <CardDescription>
                      AI-powered content summarization with intelligent sentence scoring
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      {result.english}
                    </p>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold mb-2">📊 Content Metadata</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                          <span className="text-gray-500">Source:</span>
                          <p className="font-medium">{result.metadata.source}</p>
                      </div>
                      <div>
                          <span className="text-gray-500">Word Count:</span>
                        <p className="font-medium">{result.metadata.wordCount}</p>
                      </div>
                      <div>
                          <span className="text-gray-500">Reading Time:</span>
                        <p className="font-medium">{result.metadata.readingTime}</p>
                      </div>
                      <div>
                          <span className="text-gray-500">Title:</span>
                          <p className="font-medium">{result.metadata.title}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ✅ Content processed and saved to dual database architecture (Supabase + MongoDB)
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="webhook-integration" className="space-y-6">
            <Card className="mx-auto max-w-4xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">🔗 Webhook Integration</CardTitle>
                <CardDescription>
                  Advanced webhook endpoints for automation and third-party integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Available Endpoints</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <code className="text-sm">POST /api/webhook/quotes</code>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Generate motivational quotes</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <code className="text-sm">POST /api/webhook/analyze</code>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Content analysis webhook</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <code className="text-sm">POST /api/webhook/notify</code>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Notification webhook</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Integration Features</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Rate limiting (100 req/min)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Request tracking & analytics
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        n8n workflow compatibility
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        JSON response format
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Error handling & monitoring
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="text-center mt-8">
                  <Link href="/webhooks">
                    <Button className="px-8">
                      🔗 View Webhook Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
