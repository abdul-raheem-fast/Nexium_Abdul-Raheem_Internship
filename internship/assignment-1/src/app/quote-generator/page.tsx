"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Quote as QuoteIcon, 
  Sparkles, 
  Copy, 
  Heart, 
  RefreshCw,
  Search,
  Filter,
  ArrowLeft,
  Download,
  Twitter,
  Facebook
} from "lucide-react";
import { quotes, categories, getRandomQuotes, getQuotesByCategory, searchQuotes, type Quote } from "@/data/quotes";
import Link from "next/link";

export default function QuoteGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [displayedQuotes, setDisplayedQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copySuccess, setCopySuccess] = useState<string>("");

  // Initialize with random quotes
  useEffect(() => {
    setDisplayedQuotes(getRandomQuotes(3));
  }, []);

  const generateQuotes = () => {
    setIsLoading(true);
    
    // Add a slight delay for better UX
    setTimeout(() => {
      let newQuotes: Quote[];
      
      if (searchTerm.trim()) {
        newQuotes = searchQuotes(searchTerm).slice(0, 3);
      } else if (selectedCategory === "all") {
        newQuotes = getRandomQuotes(3);
      } else {
        newQuotes = getRandomQuotes(3, selectedCategory);
      }
      
      setDisplayedQuotes(newQuotes);
      setIsLoading(false);
    }, 500);
  };

  const copyToClipboard = async (quote: Quote) => {
    const text = `"${quote.text}" - ${quote.author}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(quote.id);
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const toggleFavorite = (quoteId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(quoteId)) {
      newFavorites.delete(quoteId);
    } else {
      newFavorites.add(quoteId);
    }
    setFavorites(newFavorites);
  };

  const shareQuote = (quote: Quote, platform: 'twitter' | 'facebook') => {
    const text = `"${quote.text}" - ${quote.author}`;
    const url = encodeURIComponent(text);
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${url}`, '_blank');
    } else {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    }
  };

  const downloadQuote = (quote: Quote) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Quote text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    
    const words = quote.text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + word + ' ';
      if (ctx.measureText(testLine).width < 700) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word + ' ';
      }
    }
    lines.push(currentLine);
    
    lines.forEach((line, index) => {
      ctx.fillText(line, 400, 200 + index * 40);
    });
    
    // Author
    ctx.font = '24px Arial';
    ctx.fillText(`- ${quote.author}`, 400, 200 + lines.length * 40 + 60);
    
    // Download
    const link = document.createElement('a');
    link.download = `quote-${quote.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-4">
                  <QuoteIcon className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Quote Generator
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover inspiration from the world's greatest minds. Generate powerful quotes to motivate, inspire, and transform your perspective.
            </p>
            
            {/* Search and Filter Controls */}
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search quotes by keyword, author, or topic..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48 h-12">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={generateQuotes}
                    disabled={isLoading}
                    className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Generate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quotes Display */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {displayedQuotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {displayedQuotes.map((quote, index) => (
                <Card 
                  key={quote.id} 
                  className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  
                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300">
                          {categories.find(cat => cat.id === quote.category)?.icon} {categories.find(cat => cat.id === quote.category)?.name}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(quote.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Heart className={`h-4 w-4 ${favorites.has(quote.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 space-y-6">
                    <div className="space-y-4">
                      <QuoteIcon className="h-8 w-8 text-blue-500 opacity-30" />
                      <blockquote className="text-lg font-medium leading-relaxed text-foreground">
                        &quot;{quote.text}&quot;
                      </blockquote>
                      <cite className="text-sm font-semibold text-muted-foreground block">
                        — {quote.author}
                      </cite>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {quote.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-border/50">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(quote)}
                          className="text-muted-foreground hover:text-green-600 transition-colors"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          {copySuccess === quote.id ? "Copied!" : "Copy"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadQuote(quote)}
                          className="text-muted-foreground hover:text-blue-600 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => shareQuote(quote, 'twitter')}
                          className="text-muted-foreground hover:text-blue-400 transition-colors"
                        >
                          <Twitter className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => shareQuote(quote, 'facebook')}
                          className="text-muted-foreground hover:text-blue-600 transition-colors"
                        >
                          <Facebook className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Search className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No quotes found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or selecting a different category.
                </p>
                <Button onClick={() => { setSearchTerm(""); setSelectedCategory("all"); generateQuotes(); }}>
                  Show All Quotes
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quote Collection Stats</h2>
            <p className="text-muted-foreground">Explore our vast collection of inspiring quotes</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{quotes.length}</div>
              <div className="text-sm text-muted-foreground">Total Quotes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">{new Set(quotes.map(q => q.author)).size}</div>
              <div className="text-sm text-muted-foreground">Authors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{favorites.size}</div>
              <div className="text-sm text-muted-foreground">Favorites</div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
} 