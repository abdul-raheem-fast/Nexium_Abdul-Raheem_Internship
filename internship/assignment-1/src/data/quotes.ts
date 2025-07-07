export interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
  tags: string[];
  isFavorite?: boolean;
}

export interface QuoteCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const categories: QuoteCategory[] = [
  {
    id: "motivation",
    name: "Motivation",
    description: "Inspiring quotes to fuel your ambition",
    icon: "🔥"
  },
  {
    id: "success",
    name: "Success",
    description: "Wisdom from successful leaders and entrepreneurs",
    icon: "🏆"
  },
  {
    id: "technology",
    name: "Technology", 
    description: "Insights about innovation and the digital future",
    icon: "💻"
  },
  {
    id: "wisdom",
    name: "Wisdom",
    description: "Timeless wisdom from great thinkers",
    icon: "🧠"
  },
  {
    id: "leadership",
    name: "Leadership",
    description: "Quotes about leading and inspiring others",
    icon: "👑"
  },
  {
    id: "innovation",
    name: "Innovation",
    description: "Thoughts on creativity and breakthrough thinking",
    icon: "💡"
  },
  {
    id: "life",
    name: "Life",
    description: "Profound insights about living meaningfully",
    icon: "🌟"
  },
  {
    id: "education",
    name: "Education",
    description: "The power of learning and knowledge",
    icon: "📚"
  }
];

export const quotes: Quote[] = [
  // Motivation
  {
    id: "mot-1",
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "motivation",
    tags: ["dreams", "future", "belief"]
  },
  {
    id: "mot-2", 
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    category: "motivation",
    tags: ["perseverance", "hope", "focus"]
  },
  {
    id: "mot-3",
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "motivation",
    tags: ["success", "failure", "courage"]
  },
  {
    id: "mot-4",
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivation",
    tags: ["work", "passion", "greatness"]
  },
  {
    id: "mot-5",
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    category: "motivation",
    tags: ["persistence", "time", "progress"]
  },

  // Success
  {
    id: "suc-1",
    text: "Success is not the key to happiness. Happiness is the key to success.",
    author: "Albert Schweitzer",
    category: "success",
    tags: ["happiness", "success", "fulfillment"]
  },
  {
    id: "suc-2",
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "success",
    tags: ["action", "starting", "execution"]
  },
  {
    id: "suc-3",
    text: "Success is walking from failure to failure with no loss of enthusiasm.",
    author: "Winston Churchill", 
    category: "success",
    tags: ["failure", "enthusiasm", "resilience"]
  },
  {
    id: "suc-4",
    text: "Your limitation—it's only your imagination.",
    author: "Unknown",
    category: "success",
    tags: ["limitations", "imagination", "mindset"]
  },
  {
    id: "suc-5",
    text: "Great things never come from comfort zones.",
    author: "Unknown",
    category: "success",
    tags: ["comfort zone", "growth", "challenge"]
  },

  // Technology
  {
    id: "tech-1",
    text: "Technology is nothing. What's important is that you have a faith in people, that they're basically good and smart.",
    author: "Steve Jobs",
    category: "technology",
    tags: ["people", "faith", "human-centered"]
  },
  {
    id: "tech-2",
    text: "The advance of technology is based on making it fit in so that you don't really even notice it, so it's part of everyday life.",
    author: "Bill Gates",
    category: "technology", 
    tags: ["integration", "everyday life", "seamless"]
  },
  {
    id: "tech-3",
    text: "Any sufficiently advanced technology is indistinguishable from magic.",
    author: "Arthur C. Clarke",
    category: "technology",
    tags: ["advanced", "magic", "wonder"]
  },
  {
    id: "tech-4",
    text: "The real problem is not whether machines think but whether men do.",
    author: "B.F. Skinner",
    category: "technology",
    tags: ["machines", "thinking", "human intelligence"]
  },
  {
    id: "tech-5",
    text: "We are stuck with technology when what we really want is just stuff that works.",
    author: "Douglas Adams",
    category: "technology",
    tags: ["functionality", "simplicity", "user experience"]
  },

  // Wisdom
  {
    id: "wis-1",
    text: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates",
    category: "wisdom",
    tags: ["knowledge", "humility", "learning"]
  },
  {
    id: "wis-2",
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "wisdom",
    tags: ["difficulty", "opportunity", "perspective"]
  },
  {
    id: "wis-3",
    text: "Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.",
    author: "Bill Keane",
    category: "wisdom",
    tags: ["present", "time", "mindfulness"]
  },
  {
    id: "wis-4",
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu",
    category: "wisdom",
    tags: ["journey", "beginning", "progress"]
  },
  {
    id: "wis-5",
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
    category: "wisdom",
    tags: ["authenticity", "individuality", "self"]
  },

  // Leadership
  {
    id: "lead-1",
    text: "A leader is one who knows the way, goes the way, and shows the way.",
    author: "John C. Maxwell",
    category: "leadership",
    tags: ["direction", "example", "guidance"]
  },
  {
    id: "lead-2",
    text: "The greatest leader is not necessarily the one who does the greatest things. He is the one that gets the people to do the greatest things.",
    author: "Ronald Reagan",
    category: "leadership",
    tags: ["inspiration", "empowerment", "team"]
  },
  {
    id: "lead-3",
    text: "Leadership is not about being in charge. It's about taking care of those in your charge.",
    author: "Simon Sinek",
    category: "leadership",
    tags: ["care", "responsibility", "service"]
  },
  {
    id: "lead-4",
    text: "Before you are a leader, success is all about growing yourself. When you become a leader, success is all about growing others.",
    author: "Jack Welch",
    category: "leadership",
    tags: ["growth", "development", "others"]
  },
  {
    id: "lead-5",
    text: "A true leader has the confidence to stand alone, the courage to make tough decisions, and the compassion to listen to the needs of others.",
    author: "Douglas MacArthur",
    category: "leadership",
    tags: ["confidence", "courage", "compassion"]
  },

  // Innovation
  {
    id: "inn-1",
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    category: "innovation",
    tags: ["leadership", "distinction", "creativity"]
  },
  {
    id: "inn-2",
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "innovation",
    tags: ["action", "execution", "beginning"]
  },
  {
    id: "inn-3",
    text: "If you're not failing every now and again, it's a sign you're not doing anything very innovative.",
    author: "Woody Allen",
    category: "innovation",
    tags: ["failure", "risk", "experimentation"]
  },
  {
    id: "inn-4",
    text: "There's a way to do it better - find it.",
    author: "Thomas Edison",
    category: "innovation",
    tags: ["improvement", "discovery", "optimization"]
  },
  {
    id: "inn-5",
    text: "The secret to change is to focus all of your energy not on fighting the old, but on building the new.",
    author: "Socrates",
    category: "innovation",
    tags: ["change", "energy", "building"]
  },

  // Life
  {
    id: "life-1",
    text: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon",
    category: "life",
    tags: ["planning", "present", "unexpected"]
  },
  {
    id: "life-2",
    text: "The purpose of our lives is to be happy.",
    author: "Dalai Lama",
    category: "life",
    tags: ["purpose", "happiness", "fulfillment"]
  },
  {
    id: "life-3",
    text: "Life is really simple, but we insist on making it complicated.",
    author: "Confucius",
    category: "life",
    tags: ["simplicity", "complexity", "perspective"]
  },
  {
    id: "life-4",
    text: "In the end, we will remember not the words of our enemies, but the silence of our friends.",
    author: "Martin Luther King Jr.",
    category: "life",
    tags: ["friendship", "courage", "memory"]
  },
  {
    id: "life-5",
    text: "Life is 10% what happens to you and 90% how you react to it.",
    author: "Charles R. Swindoll",
    category: "life",
    tags: ["reaction", "attitude", "control"]
  },

  // Education
  {
    id: "edu-1",
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    category: "education",
    tags: ["power", "change", "world"]
  },
  {
    id: "edu-2",
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
    category: "education",
    tags: ["learning", "permanence", "value"]
  },
  {
    id: "edu-3",
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
    category: "education",
    tags: ["learning", "living", "forever"]
  },
  {
    id: "edu-4",
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
    category: "education",
    tags: ["reading", "knowledge", "opportunities"]
  },
  {
    id: "edu-5",
    text: "Intelligence plus character - that is the goal of true education.",
    author: "Martin Luther King Jr.",
    category: "education",
    tags: ["intelligence", "character", "true education"]
  }
];

// Utility functions
export const getQuotesByCategory = (categoryId: string): Quote[] => {
  return quotes.filter(quote => quote.category === categoryId);
};

export const getRandomQuotes = (count: number = 3, categoryId?: string): Quote[] => {
  const sourceQuotes = categoryId ? getQuotesByCategory(categoryId) : quotes;
  const shuffled = [...sourceQuotes].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, sourceQuotes.length));
};

export const searchQuotes = (searchTerm: string): Quote[] => {
  const term = searchTerm.toLowerCase();
  return quotes.filter(quote => 
    quote.text.toLowerCase().includes(term) ||
    quote.author.toLowerCase().includes(term) ||
    quote.tags.some(tag => tag.toLowerCase().includes(term))
  );
};

export const getCategoryById = (categoryId: string): QuoteCategory | undefined => {
  return categories.find(cat => cat.id === categoryId);
}; 