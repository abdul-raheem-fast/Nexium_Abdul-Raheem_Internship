// Assignment 2: Blog Summarizer API
import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { supabase, connectToMongoDB, saveSummaryToSupabase, saveContentToMongoDB } from '@/lib/database';

interface BlogSummary {
  english: string;
  urdu: string;
  metadata: {
    title: string;
    wordCount: number;
    readingTime: string;
    source: string;
  };
}

// Simple Urdu translation dictionary for basic words
const translationDict: Record<string, string> = {
  'the': 'یہ',
  'and': 'اور',
  'is': 'ہے',
  'to': 'کو',
  'in': 'میں',
  'of': 'کا',
  'for': 'کے لیے',
  'with': 'کے ساتھ',
  'on': 'پر',
  'this': 'یہ',
  'that': 'وہ',
  'are': 'ہیں',
  'can': 'کر سکتے ہیں',
  'will': 'گا',
  'have': 'ہے',
  'has': 'ہے',
  'technology': 'ٹیکنالوجی',
  'development': 'ترقی',
  'software': 'سافٹ ویئر',
  'programming': 'پروگرامنگ',
  'computer': 'کمپیوٹر',
  'internet': 'انٹرنیٹ',
  'web': 'ویب',
  'application': 'ایپلیکیشن',
  'data': 'ڈیٹا',
  'information': 'معلومات',
  'system': 'نظام',
  'user': 'صارف',
  'business': 'کاروبار',
  'company': 'کمپنی',
  'market': 'بازار',
  'product': 'پروڈکٹ',
  'service': 'خدمت',
  'solution': 'حل',
  'project': 'منصوبہ',
  'team': 'ٹیم',
  'work': 'کام',
  'time': 'وقت',
  'new': 'نیا',
  'good': 'اچھا',
  'better': 'بہتر',
  'best': 'بہترین',
  'important': 'اہم',
  'great': 'عظیم'
};

// AI-style summarization function
function generateSummary(text: string, title: string): string {
  // Extract key sentences and create a summary
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const wordCount = text.split(/\s+/).length;
  
  // Simple scoring based on position, length, and keywords
  const scoredSentences = sentences.map((sentence, index) => {
    let score = 0;
    
    // Position scoring (earlier sentences are often important)
    if (index < sentences.length * 0.3) score += 3;
    else if (index < sentences.length * 0.7) score += 2;
    else score += 1;
    
    // Length scoring (medium length sentences often contain good info)
    const words = sentence.split(/\s+/).length;
    if (words >= 10 && words <= 25) score += 2;
    
    // Keyword scoring
    const keywords = ['important', 'key', 'main', 'significant', 'crucial', 'essential', 'primary', 'major'];
    keywords.forEach(keyword => {
      if (sentence.toLowerCase().includes(keyword)) score += 1;
    });
    
    return { sentence: sentence.trim(), score };
  });
  
  // Select top sentences for summary
  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(3, Math.ceil(sentences.length * 0.2)))
    .map(item => item.sentence);
  
  // Construct summary
  let summary = `This article titled "${title}" discusses ${topSentences[0]}`;
  if (topSentences[1]) {
    summary += ` Additionally, ${topSentences[1]}`;
  }
  if (topSentences[2]) {
    summary += ` The content also covers ${topSentences[2]}`;
  }
  
  summary += ` The article provides valuable insights across ${wordCount} words of content.`;
  
  return summary;
}

// Simple translation function
function translateToUrdu(text: string): string {
  let translated = text;
  
  // Replace common words with Urdu equivalents
  Object.entries(translationDict).forEach(([english, urdu]) => {
    const regex = new RegExp(`\\b${english}\\b`, 'gi');
    translated = translated.replace(regex, urdu);
  });
  
  // Add some basic Urdu structure
  translated = translated.replace(/This article/gi, 'یہ مضمون');
  translated = translated.replace(/discusses/gi, 'بحث کرتا ہے');
  translated = translated.replace(/Additionally/gi, 'مزید برآں');
  translated = translated.replace(/provides/gi, 'فراہم کرتا ہے');
  translated = translated.replace(/valuable insights/gi, 'قیمتی بصیرت');
  translated = translated.replace(/across/gi, 'میں');
  translated = translated.replace(/words of content/gi, 'الفاظ کا مواد');
  
  return translated;
}

// Calculate reading time
function calculateReadingTime(wordCount: number): string {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Scrape the blog content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract content using multiple selectors
    let title = $('title').text() || 
                $('h1').first().text() || 
                $('meta[property="og:title"]').attr('content') || 
                'Blog Article';
    
    // Clean title
    title = title.replace(/\s+/g, ' ').trim();
    
    // Extract main content
    let content = '';
    
    // Try different content selectors
    const contentSelectors = [
      'article',
      '[role="main"]',
      '.post-content',
      '.entry-content', 
      '.content',
      'main',
      '.article-content',
      '.post-body'
    ];
    
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.text();
        break;
      }
    }
    
    // Fallback to body if no specific content area found
    if (!content || content.length < 100) {
      content = $('body').text();
    }
    
    // Clean and process content
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim();
    
    if (content.length < 100) {
      return NextResponse.json(
        { error: 'Could not extract sufficient content from the URL' },
        { status: 400 }
      );
    }
    
    // Limit content length for processing
    if (content.length > 5000) {
      content = content.substring(0, 5000);
    }
    
    const wordCount = content.split(/\s+/).length;
    const readingTime = calculateReadingTime(wordCount);
    
    // Generate AI-style summary
    const englishSummary = generateSummary(content, title);
    
    // Translate to Urdu
    const urduSummary = translateToUrdu(englishSummary);
    
    // Prepare response
    const result: BlogSummary = {
      english: englishSummary,
      urdu: urduSummary,
      metadata: {
        title,
        wordCount,
        readingTime,
        source: new URL(url).hostname
      }
    };
    
    // Store in databases (with error handling)
    try {
      // Store summary in Supabase
      if (supabase) {
        await supabase.from('summaries').insert({
          url,
          title,
          summary: englishSummary,
          urdu_summary: urduSummary,
          created_at: new Date().toISOString()
        });
      }
      
      // Store full content in MongoDB
      const mongodb = await connectMongoDB();
      if (mongodb) {
        await mongodb.collection('blog_content').insertOne({
          url,
          title,
          full_content: content,
          english_summary: englishSummary,
          urdu_summary: urduSummary,
          metadata: {
            word_count: wordCount,
            reading_time: readingTime,
            source_domain: new URL(url).hostname,
            scraped_at: new Date()
          }
        });
      }
    } catch (dbError) {
      console.error('Database storage error:', dbError);
      // Continue with response even if database storage fails
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Summarization error:', error);
    
    return NextResponse.json({
      error: 'Failed to process the blog URL',
      details: String(error)
    }, { status: 500 });
  }
} 