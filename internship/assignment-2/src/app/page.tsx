"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Globe, 
  FileText, 
  Languages, 
  Database,
  Loader2,
  ExternalLink,
  BookOpen,
  Sparkles
} from "lucide-react";

interface BlogResult {
  url: string;
  title: string;
  summary: string;
  urduSummary: string;
  timestamp: string;
}

export default function BlogSummarizer() {
  const [blogUrl, setBlogUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<BlogResult | null>(null);

  const handleSummarize = async () => {
    if (!blogUrl.trim()) return;
    
    setIsLoading(true);
    // TODO: Implement scraping, summarization, and translation
    
    // Simulate processing for Day 1
    setTimeout(() => {
      setResult({
        url: blogUrl,
        title: "Sample Blog Title",
        summary: "This will contain the AI-generated summary...",
        urduSummary: "یہ AI سے تیار کردہ خلاصہ ہوگا...",
        timestamp: new Date().toISOString()
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-green-600 rounded-full p-3">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Blog Summarizer
                </h1>
                <p className="text-sm text-muted-foreground">Assignment 2: AI-Powered Content Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
              Smart Blog Analysis
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Enter any blog URL to get AI-powered summaries in English and Urdu, stored automatically in your databases.
            </p>

            {/* URL Input Form */}
            <div className="max-w-2xl mx-auto mb-12">
              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    Enter Blog URL
                  </CardTitle>
                  <CardDescription>
                    Paste any blog URL to start the AI summarization process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Input
                      placeholder="https://example.com/blog-post"
                      value={blogUrl}
                      onChange={(e) => setBlogUrl(e.target.value)}
                      className="h-12 text-lg"
                      disabled={isLoading}
                    />
                    <Button 
                      onClick={handleSummarize}
                      disabled={!blogUrl.trim() || isLoading}
                      className="h-12 px-8 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Summarize
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Result Display */}
            {result && (
              <div className="max-w-4xl mx-auto space-y-6">
                <Card className="text-left">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      Original Blog
                    </CardTitle>
                    <CardDescription className="break-all">
                      {result.url}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* English Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        English Summary
                      </CardTitle>
                      <CardDescription>AI-generated content summary</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="leading-relaxed">{result.summary}</p>
                    </CardContent>
                  </Card>

                  {/* Urdu Translation */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Languages className="h-5 w-5 text-green-500" />
                        Urdu Translation
                      </CardTitle>
                      <CardDescription>Translated summary in Urdu</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="leading-relaxed text-right" dir="rtl">
                        {result.urduSummary}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">How It Works</h3>
            <p className="text-muted-foreground">Advanced AI-powered blog analysis pipeline</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">1. Web Scraping</h4>
              <p className="text-sm text-muted-foreground">Extract content from blog URLs using Cheerio</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">2. AI Summary</h4>
              <p className="text-sm text-muted-foreground">Generate intelligent summaries with static logic</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Languages className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">3. Translation</h4>
              <p className="text-sm text-muted-foreground">Convert to Urdu using JS dictionary</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Database className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">4. Storage</h4>
              <p className="text-sm text-muted-foreground">Save summaries in Supabase, full text in MongoDB</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-4 text-sm text-muted-foreground">
            <span>Assignment 2: Blog Summarizer</span>
            <span>•</span>
            <span>Day 1: Foundation & UI Setup</span>
            <span>•</span>
            <span>Built with Next.js 15 & TypeScript</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
