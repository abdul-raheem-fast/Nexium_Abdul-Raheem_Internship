'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

interface AnalyticsData {
  overview: {
    totalBlogsSummarized: number;
    totalWebhookRequests: number;
    averageProcessingTime: number;
    systemUptime: string;
    successRate: number;
  };
  blog_summaries: {
    totalSummaries: number;
    totalWordCount: number;
    avgWordCount: number;
    topDomains: Array<[string, number]>;
    recentActivity: any[];
    processing_trends: {
      avgScrapeTime: number;
      avgSummaryTime: number;
      avgTranslationTime: number;
    };
  };
  webhook_analytics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    successRate: number;
    avgProcessingTime: number;
    triggerStats: Record<string, number>;
    hourlyStats: Record<number, number>;
    recentActivities: any[];
  };
  system_health: {
    supabase: boolean;
    mongodb: boolean;
    timestamp: string;
  };
  performance_metrics: {
    response_times: {
      p50: number;
      p95: number;
      p99: number;
    };
    error_rates: {
      total_errors: number;
      error_rate: number;
      common_errors: Array<{ error: string; count: number }>;
    };
    resource_usage: {
      database_queries: number;
      cache_hits: number;
      cache_misses: number;
    };
  };
}

interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
  real_time: {
    current_active_users: number;
    requests_per_minute: number;
    average_response_time_1m: number;
    system_load: number;
    memory_usage: number;
    cpu_usage: number;
  };
  trends: {
    daily_summaries: Array<{ date: string; count: number; success_rate: number }>;
    hourly_webhooks: Array<{ hour: number; requests: number; success_rate: number }>;
    category_popularity: Array<{ trigger: string; count: number; percentage: number }>;
  };
  insights: {
    top_performing_category: string;
    peak_usage_hour: number;
    processing_efficiency: string;
    system_status: string;
    recommendations: string[];
  };
  metadata: {
    query_time: number;
    time_range_days: number;
    generated_at: string;
  };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('7');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?range=${timeRange}&details=true`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const result = await response.json();
      setData(result);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchAnalytics();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, timeRange]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatPercentage = (value: number): string => {
    return (value * 100).toFixed(1) + '%';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="container mx-auto p-6">
          <div className="text-center py-20">
            <div className="animate-spin h-12 w-12 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading analytics dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="container mx-auto p-6">
          <div className="text-center py-20">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2">Analytics Unavailable</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <button 
              onClick={fetchAnalytics}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Auto-refresh:</span>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    autoRefresh 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {autoRefresh ? '🟢 ON' : '🔴 OFF'}
                </button>
              </div>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1 rounded-lg border text-sm bg-white dark:bg-gray-800"
              >
                <option value="1">Last 24 hours</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
              </select>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            📊 Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-1">
            Real-time insights and performance metrics
          </p>
          <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
            <span>🕐 Last updated: {new Date(data?.metadata.generated_at || '').toLocaleTimeString()}</span>
            <span>⚡ Query time: {data?.metadata.query_time}ms</span>
            <Badge variant={data?.insights.system_status === 'Healthy' ? 'default' : 'destructive'}>
              {data?.insights.system_status}
            </Badge>
          </div>
        </div>

        {/* System Health Banner */}
        <div className="mb-8">
          <Card className="border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">🟢</div>
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200">System Status: {data?.insights.system_status}</h3>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      Uptime: {data?.data.overview.systemUptime} | Success Rate: {data?.data.overview.successRate}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${data?.data.system_health.supabase ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>Supabase</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${data?.data.system_health.mongodb ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>MongoDB</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Blogs Summarized</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(data?.data.overview.totalBlogsSummarized || 0)}</div>
              <p className="text-xs opacity-75 mt-1">Total processed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Webhook Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(data?.data.overview.totalWebhookRequests || 0)}</div>
              <p className="text-xs opacity-75 mt-1">API calls made</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Avg Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data?.data.overview.averageProcessingTime || 0}ms</div>
              <p className="text-xs opacity-75 mt-1">
                {data?.insights.processing_efficiency || 'Good'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data?.data.overview.successRate || 0}%</div>
              <p className="text-xs opacity-75 mt-1">Overall reliability</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data?.real_time.current_active_users || 0}</div>
              <p className="text-xs opacity-75 mt-1">Currently online</p>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📈 Real-time Metrics
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Requests/min</span>
                <span className="font-semibold">{data?.real_time.requests_per_minute}/min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">System Load</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        (data?.real_time.system_load || 0) > 0.8 ? 'bg-red-500' : 
                        (data?.real_time.system_load || 0) > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${((data?.real_time.system_load || 0) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{formatPercentage(data?.real_time.system_load || 0)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Memory Usage</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${((data?.real_time.memory_usage || 0) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{formatPercentage(data?.real_time.memory_usage || 0)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">CPU Usage</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-300"
                      style={{ width: `${((data?.real_time.cpu_usage || 0) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{formatPercentage(data?.real_time.cpu_usage || 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🚀 Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{data?.data.performance_metrics.response_times.p50}ms</div>
                  <div className="text-xs text-gray-500">P50</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{data?.data.performance_metrics.response_times.p95}ms</div>
                  <div className="text-xs text-gray-500">P95</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{data?.data.performance_metrics.response_times.p99}ms</div>
                  <div className="text-xs text-gray-500">P99</div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Error Rate</span>
                  <span className="font-semibold text-red-600">{data?.data.performance_metrics.error_rates.error_rate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cache Hit Rate</span>
                  <span className="font-semibold text-blue-600">
                    {Math.round(((data?.data.performance_metrics.resource_usage.cache_hits || 0) / 
                    ((data?.data.performance_metrics.resource_usage.cache_hits || 0) + 
                     (data?.data.performance_metrics.resource_usage.cache_misses || 1))) * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💡 Smart Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Top Category:</span>
                <span className="ml-2 font-semibold text-blue-600">{data?.insights.top_performing_category}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Peak Hour:</span>
                <span className="ml-2 font-semibold text-purple-600">{data?.insights.peak_usage_hour}:00</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Efficiency:</span>
                <Badge variant="secondary" className="ml-2">{data?.insights.processing_efficiency}</Badge>
              </div>
              <div className="pt-2 border-t">
                <div className="text-xs text-gray-500 mb-2">Recommendations:</div>
                <div className="space-y-1">
                  {data?.insights.recommendations.slice(0, 2).map((rec, index) => (
                    <div key={index} className="text-xs p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-blue-800 dark:text-blue-200">
                      💡 {rec}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics Tabs */}
        <Tabs defaultValue="blog-analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="blog-analytics">📝 Blog Analytics</TabsTrigger>
            <TabsTrigger value="webhook-analytics">🔗 Webhook Analytics</TabsTrigger>
            <TabsTrigger value="performance-analytics">⚡ Performance</TabsTrigger>
            <TabsTrigger value="trends-analytics">📈 Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="blog-analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>📊 Summary Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{formatNumber(data?.data.blog_summaries.totalSummaries || 0)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Summaries</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{formatNumber(data?.data.blog_summaries.totalWordCount || 0)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Words Processed</div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{data?.data.blog_summaries.avgWordCount || 0}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Words per Article</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🌐 Top Domains</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data?.data.blog_summaries.topDomains.slice(0, 5).map(([domain, count], index) => (
                      <div key={domain} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <span className="font-medium">{domain}</span>
                        </div>
                        <Badge variant="secondary">{count} articles</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>⚡ Processing Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">{data?.data.blog_summaries.processing_trends.avgScrapeTime || 0}ms</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Scraping Time</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{data?.data.blog_summaries.processing_trends.avgSummaryTime || 0}ms</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Summary Time</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{data?.data.blog_summaries.processing_trends.avgTranslationTime || 0}ms</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Translation Time</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhook-analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>🔗 Webhook Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{formatNumber(data?.data.webhook_analytics.totalRequests || 0)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Requests</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{data?.data.webhook_analytics.successRate || 0}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{data?.data.webhook_analytics.avgProcessingTime || 0}ms</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Response Time</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📊 Trigger Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(data?.data.webhook_analytics.triggerStats || {}).map(([trigger, count]) => (
                      <div key={trigger} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="font-medium capitalize">{trigger.replace('_', ' ')}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ 
                                width: `${((count / Math.max(...Object.values(data?.data.webhook_analytics.triggerStats || {}))) * 100)}%` 
                              }}
                            ></div>
                          </div>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance-analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>⚡ Response Time Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="font-medium">50th Percentile (P50)</span>
                      <span className="text-green-600 font-bold">{data?.data.performance_metrics.response_times.p50}ms</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <span className="font-medium">95th Percentile (P95)</span>
                      <span className="text-yellow-600 font-bold">{data?.data.performance_metrics.response_times.p95}ms</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <span className="font-medium">99th Percentile (P99)</span>
                      <span className="text-red-600 font-bold">{data?.data.performance_metrics.response_times.p99}ms</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🚨 Error Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg mb-4">
                      <div className="text-2xl font-bold text-red-600">{data?.data.performance_metrics.error_rates.total_errors || 0}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Errors ({data?.data.performance_metrics.error_rates.error_rate}%)</div>
                    </div>
                    {data?.data.performance_metrics.error_rates.common_errors.slice(0, 3).map((error, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">{error.error}</span>
                        <Badge variant="destructive">{error.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>💾 Resource Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{formatNumber(data?.data.performance_metrics.resource_usage.database_queries || 0)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Database Queries</div>
                  </div>
                  <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">{formatNumber(data?.data.performance_metrics.resource_usage.cache_hits || 0)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Cache Hits</div>
                  </div>
                  <div className="text-center p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600 mb-2">{formatNumber(data?.data.performance_metrics.resource_usage.cache_misses || 0)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Cache Misses</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends-analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>📈 Daily Summary Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data?.trends?.daily_summaries.slice(-7).map((day) => (
                      <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">{new Date(day.date).toLocaleDateString()}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">{day.count} summaries</span>
                          <Badge variant={day.success_rate > 95 ? 'default' : 'secondary'}>
                            {day.success_rate}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🕐 Hourly Webhook Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-2">
                    {Array.from({ length: 24 }, (_, hour) => {
                      const requests = data?.trends?.hourly_webhooks.find(h => h.hour === hour)?.requests || 0;
                      const maxRequests = Math.max(...(data?.trends?.hourly_webhooks.map(h => h.requests) || [1]));
                      const intensity = requests / maxRequests;
                      
                      return (
                        <div key={hour} className="text-center">
                          <div 
                            className={`w-full h-8 rounded mb-1 transition-all duration-300 ${
                              intensity > 0.7 ? 'bg-red-500' :
                              intensity > 0.4 ? 'bg-yellow-500' :
                              intensity > 0.1 ? 'bg-blue-500' : 'bg-gray-200'
                            }`}
                            style={{ opacity: Math.max(0.2, intensity) }}
                            title={`${hour}:00 - ${requests} requests`}
                          ></div>
                          <div className="text-xs text-gray-500">{hour}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 text-xs text-gray-500 text-center">
                    Peak activity at {data?.insights.peak_usage_hour}:00
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>🏆 Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.trends?.category_popularity.sort((a, b) => b.count - a.count).slice(0, 5).map((category, index) => (
                    <div key={category.trigger} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium capitalize">{category.trigger.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                        <Badge variant="secondary">{category.count} ({category.percentage}%)</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recommendations Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 Smart Recommendations
              <Badge variant="secondary">AI-Powered</Badge>
            </CardTitle>
            <CardDescription>
              Actionable insights based on your system performance and usage patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data?.insights.recommendations.map((recommendation, index) => (
                <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-200">{recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 