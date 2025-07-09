// Day 8: Quote Database for n8n Webhook Integration
export interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  { id: 'motivation', name: 'Motivation', description: 'Inspiring quotes to motivate and drive success', icon: '🚀' },
  { id: 'success', name: 'Success', description: 'Wisdom about achieving goals and success', icon: '🏆' },
  { id: 'life', name: 'Life', description: 'Profound thoughts about life and living', icon: '🌱' },
  { id: 'wisdom', name: 'Wisdom', description: 'Timeless wisdom from great minds', icon: '🧠' },
  { id: 'love', name: 'Love', description: 'Beautiful quotes about love and relationships', icon: '❤️' },
  { id: 'happiness', name: 'Happiness', description: 'Quotes about joy and contentment', icon: '😊' },
  { id: 'strength', name: 'Strength', description: 'Building resilience and inner strength', icon: '💪' },
  { id: 'dreams', name: 'Dreams', description: 'Pursuing aspirations and goals', icon: '✨' }
];

export const quotes: Quote[] = [
  // Motivation
  {
    id: 'mot1',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    category: 'motivation',
    tags: ['work', 'passion', 'greatness']
  },
  {
    id: 'mot2',
    text: 'Innovation distinguishes between a leader and a follower.',
    author: 'Steve Jobs',
    category: 'motivation',
    tags: ['innovation', 'leadership', 'technology']
  },
  {
    id: 'mot3',
    text: 'Your limitation—it\'s only your imagination.',
    author: 'Unknown',
    category: 'motivation',
    tags: ['limits', 'imagination', 'potential']
  },

  // Success
  {
    id: 'suc1',
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
    category: 'success',
    tags: ['persistence', 'courage', 'resilience']
  },
  {
    id: 'suc2',
    text: 'The way to get started is to quit talking and begin doing.',
    author: 'Walt Disney',
    category: 'success',
    tags: ['action', 'beginning', 'execution']
  },
  {
    id: 'suc3',
    text: 'Don\'t be afraid to give up the good to go for the great.',
    author: 'John D. Rockefeller',
    category: 'success',
    tags: ['ambition', 'improvement', 'excellence']
  },

  // Life
  {
    id: 'lif1',
    text: 'Life is what happens to you while you\'re busy making other plans.',
    author: 'John Lennon',
    category: 'life',
    tags: ['planning', 'present', 'awareness']
  },
  {
    id: 'lif2',
    text: 'The purpose of our lives is to be happy.',
    author: 'Dalai Lama',
    category: 'life',
    tags: ['purpose', 'happiness', 'meaning']
  },
  {
    id: 'lif3',
    text: 'Life is really simple, but we insist on making it complicated.',
    author: 'Confucius',
    category: 'life',
    tags: ['simplicity', 'complexity', 'philosophy']
  },

  // Wisdom
  {
    id: 'wis1',
    text: 'The only true wisdom is in knowing you know nothing.',
    author: 'Socrates',
    category: 'wisdom',
    tags: ['knowledge', 'humility', 'learning']
  },
  {
    id: 'wis2',
    text: 'Yesterday is history, tomorrow is a mystery, today is a gift.',
    author: 'Eleanor Roosevelt',
    category: 'wisdom',
    tags: ['time', 'present', 'mindfulness']
  },
  {
    id: 'wis3',
    text: 'It does not matter how slowly you go as long as you do not stop.',
    author: 'Confucius',
    category: 'wisdom',
    tags: ['persistence', 'progress', 'patience']
  },

  // Love
  {
    id: 'lov1',
    text: 'Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.',
    author: 'Lao Tzu',
    category: 'love',
    tags: ['strength', 'courage', 'relationships']
  },
  {
    id: 'lov2',
    text: 'The best thing to hold onto in life is each other.',
    author: 'Audrey Hepburn',
    category: 'love',
    tags: ['connection', 'support', 'togetherness']
  },

  // Happiness
  {
    id: 'hap1',
    text: 'Happiness is not something ready made. It comes from your own actions.',
    author: 'Dalai Lama',
    category: 'happiness',
    tags: ['choice', 'action', 'responsibility']
  },
  {
    id: 'hap2',
    text: 'The most important thing is to enjoy your life—to be happy—it\'s all that matters.',
    author: 'Audrey Hepburn',
    category: 'happiness',
    tags: ['enjoyment', 'priorities', 'contentment']
  },

  // Strength
  {
    id: 'str1',
    text: 'You have power over your mind - not outside events. Realize this, and you will find strength.',
    author: 'Marcus Aurelius',
    category: 'strength',
    tags: ['mindset', 'control', 'stoicism']
  },
  {
    id: 'str2',
    text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.',
    author: 'Ralph Waldo Emerson',
    category: 'strength',
    tags: ['inner-strength', 'potential', 'self-belief']
  },

  // Dreams
  {
    id: 'dre1',
    text: 'All our dreams can come true, if we have the courage to pursue them.',
    author: 'Walt Disney',
    category: 'dreams',
    tags: ['courage', 'pursuit', 'achievement']
  },
  {
    id: 'dre2',
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
    category: 'dreams',
    tags: ['future', 'belief', 'beauty']
  }
];

// Utility functions for the webhook system
export function getRandomQuotes(count: number, categoryId?: string): Quote[] {
  const filteredQuotes = categoryId && categoryId !== 'all' 
    ? quotes.filter(quote => quote.category === categoryId)
    : quotes;
  
  const shuffled = [...filteredQuotes].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
}

export function getQuoteById(id: string): Quote | undefined {
  return quotes.find(quote => quote.id === id);
}

export function getQuotesByCategory(categoryId: string): Quote[] {
  return quotes.filter(quote => quote.category === categoryId);
}

export function searchQuotes(searchTerm: string): Quote[] {
  const term = searchTerm.toLowerCase();
  return quotes.filter(quote => 
    quote.text.toLowerCase().includes(term) ||
    quote.author.toLowerCase().includes(term) ||
    quote.tags.some(tag => tag.toLowerCase().includes(term))
  );
} 