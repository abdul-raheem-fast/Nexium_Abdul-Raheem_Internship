// Blog Summarizer API
import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { 
  SupabaseService, 
  MongoService, 
  generateContentHash, 
  calculateProcessingStats,
  type BlogSummary,
  type BlogContent
} from '@/lib/database';

// Helper function to calculate sentence importance score
function calculateSentenceScore(sentence: string, allSentences: string[]): number {
  const words = sentence.toLowerCase().split(/\s+/);
  let score = 0;
  
  // Word frequency scoring
  const wordFreq = allSentences.join(' ').toLowerCase().split(/\s+/).reduce((freq, word) => {
    freq[word] = (freq[word] || 0) + 1;
    return freq;
  }, {} as Record<string, number>);
  
  words.forEach(word => {
    if (word.length > 3 && wordFreq[word]) {
      score += Math.log(wordFreq[word] + 1);
    }
  });
  
  // Position scoring (earlier sentences are more important)
  const position = allSentences.indexOf(sentence);
  score += (allSentences.length - position) / allSentences.length * 10;
  
  // Length scoring (prefer moderate length sentences)
  const idealLength = 20;
  const lengthPenalty = Math.abs(words.length - idealLength) / idealLength;
  score -= lengthPenalty * 5;
  
  return score;
}

// Smart text summarization function
function generateSummary(text: string, numSentences: number = 3): string {
  // Split into sentences using regex that handles common punctuation
  const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
  
  if (sentences.length <= numSentences) {
    return text;
  }
  
  // Calculate scores for each sentence
  const sentencesWithScores = sentences.map(sentence => ({
    sentence: sentence.trim(),
    score: calculateSentenceScore(sentence.trim(), sentences)
  }));
  
  // Sort by score and take top sentences
  const topSentences = sentencesWithScores
    .sort((a, b) => b.score - a.score)
    .slice(0, numSentences)
    .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
    .map(item => item.sentence);
  
  return topSentences.join(' ');
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  const checkpoints: number[] = [];
  
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }
    
    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }
    
    console.log('Processing URL:', url);
    
    // Check if URL already processed (caching)
    const existingSummary = await SupabaseService.checkUrlExists(url);
    if (existingSummary) {
      console.log('Returning cached summary for:', url);
      return NextResponse.json({
        english: existingSummary.summary,
        metadata: {
          title: existingSummary.title,
          wordCount: existingSummary.word_count,
          readingTime: existingSummary.reading_time,
          source: existingSummary.source_domain
        },
        cached: true,
        processedAt: existingSummary.processed_at
      });
    }
    
    // Fetch and scrape content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    checkpoints[0] = Date.now(); // Scraping completed
    
    // Extract title
    const title = $('title').text().trim() || 
                 $('h1').first().text().trim() || 
                 'Untitled Article';
    
    // Extract main content
    $('script, style, nav, header, footer, aside, .navigation, .sidebar, .menu').remove();
    
    const contentSelectors = [
      'article',
      '.post-content',
      '.entry-content', 
      '.content',
      'main',
      '.main-content',
      '.article-body',
      '.post-body'
    ];
    
    let content = '';
    let extractionMethod = 'body';
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length && element.text().trim().length > 200) {
        content = element.text().trim();
        extractionMethod = selector;
        break;
      }
    }
    
    // Fallback to body content
    if (!content) {
      content = $('body').text().trim();
      extractionMethod = 'body-fallback';
    }
    
    // Clean content
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim();
    
    if (content.length < 100) {
      return NextResponse.json(
        { error: 'Unable to extract sufficient content from the URL' },
        { status: 400 }
      );
    }
    
    // Generate summary
    const summary = generateSummary(content, 3);
    checkpoints[1] = Date.now(); // Summarization completed
    
    const processingStats = calculateProcessingStats(startTime, checkpoints);
    
    // Calculate metadata
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200) + ' min read';
    const sourceDomain = new URL(url).hostname;
    const contentHash = generateContentHash(content);
    const processedAt = new Date().toISOString();
    
    // Save to databases in parallel
    const savePromises = [
      // Save summary to Supabase
      SupabaseService.saveBlogSummary({
        url,
        title: title.substring(0, 100) + (title.length > 100 ? '...' : ''),
        summary,
        urdu_summary: '', // Removed Urdu translation
        word_count: wordCount,
        reading_time: readingTime,
        source_domain: sourceDomain,
        processed_at: processedAt,
        content_hash: contentHash
      }),
      
      // Save full content to MongoDB
      MongoService.saveBlogContent({
        url,
        title,
        full_content: content,
        metadata: {
          scraped_at: new Date(),
          word_count: wordCount,
          source_domain: sourceDomain,
          content_length: content.length,
          extraction_method: extractionMethod
        },
        processing_stats: processingStats
      })
    ];
    
    // Execute saves in parallel
    try {
      await Promise.all(savePromises);
      console.log('Successfully saved to both databases');
    } catch (dbError) {
      console.error('Database save error (non-blocking):', dbError);
      // Continue with response even if database save fails
    }
    
    const result = {
      english: summary,
      metadata: {
        title: title.substring(0, 100) + (title.length > 100 ? '...' : ''),
        wordCount,
        readingTime,
        source: sourceDomain
      },
      processing: {
        duration: Date.now() - startTime,
        steps: {
          scraping: processingStats.scrape_duration,
          summarization: processingStats.summary_duration
        }
      },
      cached: false,
      processedAt
    };

    console.log('Blog processing completed successfully');
    return NextResponse.json(result);

  } catch (error) {
    console.error('API Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: 'Failed to process the blog URL. Please check if the URL is accessible and contains readable content.',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 