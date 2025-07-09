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
  urdu: string;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Nexium Internship Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Muhammad Abdul Raheem Khan - Day 8 Showcase
          </p>
          <div className="flex justify-center gap-2 mb-6">
            <Badge variant="secondary">Assignment 2: Blog Summarizer</Badge>
            <Badge variant="outline">Day 8: n8n Webhooks</Badge>
          </div>
          
          {/* Quick Navigation */}
          <div className="flex justify-center gap-4 mb-8">
            <Link href="/webhooks">
              <Button variant="outline" className="flex items-center gap-2">
                🔗 Webhook Dashboard
              </Button>
            </Link>
            <Link href="/api/webhook/quotes" target="_blank">
              <Button variant="outline" className="flex items-center gap-2">
                📚 API Docs
              </Button>
            </Link>
          </div>
        </div>

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
                  Enter a blog URL to automatically extract, summarize, and translate content
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
            <div className="grid gap-4 md:grid-cols-4 max-w-4xl mx-auto">
              {[
                { step: 1, title: 'Extract', desc: 'Scrape blog content using Cheerio', icon: '🔍' },
                { step: 2, title: 'Summarize', desc: 'Generate AI-style summary with logic', icon: '🤖' },
                { step: 3, title: 'Translate', desc: 'Convert to Urdu using dictionary', icon: '🌐' },
                { step: 4, title: 'Store', desc: 'Save to Supabase & MongoDB', icon: '💾' }
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
              <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      🇺🇸 English Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {result.english}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      🇵🇰 Urdu Translation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed" dir="rtl">
                      {result.urdu}
                    </p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>📊 Metadata</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <span className="text-sm text-gray-500">Title</span>
                        <p className="font-medium">{result.metadata.title}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Word Count</span>
                        <p className="font-medium">{result.metadata.wordCount}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Reading Time</span>
                        <p className="font-medium">{result.metadata.readingTime}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Source</span>
                        <p className="font-medium truncate">{result.metadata.source}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="webhook-integration" className="space-y-8">
            {/* Day 8 Webhook Showcase */}
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">🔗 Day 8: n8n Webhook Integration</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Advanced automation workflows connecting Quote Generator with n8n platform
              </p>
            </div>

            {/* Webhook Features */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[
                {
                  icon: '⚡',
                  title: 'Real-time Triggers',
                  description: 'Instant webhook responses for n8n workflow automation',
                  features: ['Quote generation', 'Daily inspiration', 'Category analysis']
                },
                {
                  icon: '🔄',
                  title: 'Automated Workflows',
                  description: 'Seamless integration with external automation platforms',
                  features: ['Scheduled quotes', 'Event-driven responses', 'Batch processing']
                },
                {
                  icon: '📊',
                  title: 'Live Monitoring',
                  description: 'Real-time dashboard for webhook activity tracking',
                  features: ['Response times', 'Success rates', 'Error logging']
                },
                {
                  icon: '🎯',
                  title: 'Custom Payloads',
                  description: 'Flexible JSON configurations for diverse automation needs',
                  features: ['Category filtering', 'Count customization', 'Format options']
                },
                {
                  icon: '📱',
                  title: 'API Documentation',
                  description: 'Complete integration guide with examples and best practices',
                  features: ['Endpoint reference', 'Payload examples', 'Error handling']
                },
                {
                  icon: '🚀',
                  title: 'Production Ready',
                  description: 'Enterprise-grade webhook system with proper error handling',
                  features: ['TypeScript safety', 'Logging system', 'Graceful failures']
                }
              ].map((feature) => (
                <Card key={feature.title} className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{feature.icon}</span>
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {feature.features.map((item) => (
                        <li key={item} className="text-sm flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Demo */}
            <Card className="max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle>🎮 Try the Webhook System</CardTitle>
                <CardDescription>
                  Experience the power of automated workflows with our live webhook endpoint
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Link href="/webhooks">
                    <Button className="w-full h-16 text-lg">
                      🚀 Launch Webhook Dashboard
                      <br />
                      <span className="text-sm opacity-75">Test and monitor automation</span>
                    </Button>
                  </Link>
                  <Link href="/api/webhook/quotes" target="_blank">
                    <Button variant="outline" className="w-full h-16 text-lg">
                      📚 View API Documentation
                      <br />
                      <span className="text-sm opacity-75">Integration guide & examples</span>
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">Webhook Endpoint:</h3>
                  <code className="text-sm">POST /api/webhook/quotes</code>
                  <p className="text-xs text-gray-500 mt-2">
                    Ready for n8n integration with multiple automation triggers
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 text-sm">
            Built with Next.js 15, TypeScript, ShadCN UI, and Modern Web Technologies
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Nexium Internship • Day 8 Assignment • Muhammad Abdul Raheem Khan
          </p>
        </div>
      </div>
    </div>
  );
}
