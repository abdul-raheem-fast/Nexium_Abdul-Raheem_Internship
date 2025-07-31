/**
 * AI Mood Analyzer
 * Provides sentiment analysis and mood insights using OpenAI GPT-4
 */

import OpenAI from 'openai';

class MoodAnalyzer {
  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey: apiKey
    });
  }

  /**
   * Analyze mood entry sentiment and extract insights
   * @param {Object} moodEntry - The mood entry to analyze
   * @returns {Object} Analysis results
   */
  async analyzeMoodEntry(moodEntry) {
    try {
      const prompt = this.buildMoodAnalysisPrompt(moodEntry);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a mental health AI assistant specialized in mood analysis. Provide empathetic, professional insights while maintaining appropriate boundaries."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const analysis = this.parseAnalysisResponse(response.choices[0].message.content);
      
      return {
        success: true,
        analysis: {
          sentiment: analysis.sentiment || 0,
          emotions: analysis.emotions || [],
          themes: analysis.themes || [],
          suggestions: analysis.suggestions || [],
          riskLevel: analysis.riskLevel || 'low',
          insights: analysis.insights || ''
        }
      };

    } catch (error) {
      console.error('Mood analysis error:', error);
      return {
        success: false,
        error: 'Failed to analyze mood entry',
        analysis: this.getDefaultAnalysis()
      };
    }
  }

  /**
   * Build prompt for mood analysis
   * @param {Object} moodEntry - Mood entry data
   * @returns {string} Analysis prompt
   */
  buildMoodAnalysisPrompt(moodEntry) {
    return `
Analyze this mood entry and provide insights:

Mood Score: ${moodEntry.moodScore}/10
Mood Type: ${moodEntry.moodType}
Energy Level: ${moodEntry.energy}/10
Anxiety Level: ${moodEntry.anxiety}/10
Stress Level: ${moodEntry.stress}/10
Sleep Quality: ${moodEntry.sleep}/10
Activities: ${moodEntry.activities?.join(', ') || 'None specified'}
Notes: "${moodEntry.notes || 'No notes provided'}"

Please provide:
1. Sentiment score (-1 to 1)
2. Primary emotions detected
3. Key themes or topics
4. Helpful suggestions (2-3 items)
5. Risk level (low/medium/high)
6. Brief supportive insight

Format as JSON with keys: sentiment, emotions, themes, suggestions, riskLevel, insights
    `.trim();
  }

  /**
   * Parse AI response into structured analysis
   * @param {string} response - AI response text
   * @returns {Object} Parsed analysis
   */
  parseAnalysisResponse(response) {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback parsing if JSON extraction fails
      return this.fallbackParsing(response);
      
    } catch (error) {
      console.error('Response parsing error:', error);
      return this.getDefaultAnalysis();
    }
  }

  /**
   * Fallback parsing for non-JSON responses
   * @param {string} response - AI response text
   * @returns {Object} Parsed analysis
   */
  fallbackParsing(response) {
    return {
      sentiment: 0,
      emotions: ['neutral'],
      themes: ['general'],
      suggestions: ['Continue tracking your mood regularly'],
      riskLevel: 'low',
      insights: response.substring(0, 200) + '...'
    };
  }

  /**
   * Get default analysis for error cases
   * @returns {Object} Default analysis
   */
  getDefaultAnalysis() {
    return {
      sentiment: 0,
      emotions: ['neutral'],
      themes: ['general'],
      suggestions: [
        'Continue tracking your mood regularly',
        'Consider speaking with a mental health professional if needed'
      ],
      riskLevel: 'low',
      insights: 'Unable to analyze at this time. Your mental health matters - consider reaching out for support if needed.'
    };
  }

  /**
   * Generate personalized activity recommendations
   * @param {Object} userContext - User's current context
   * @returns {Object} Activity recommendations
   */
  async generateActivityRecommendations(userContext) {
    try {
      const prompt = `
Based on this user context, suggest 3-5 personalized activities:

Current Mood: ${userContext.currentMood}/10
Mood Type: ${userContext.moodType}
Energy Level: ${userContext.energy}/10
Available Time: ${userContext.availableTime} minutes
Location: ${userContext.location}
Recent Activities: ${userContext.recentActivities?.join(', ') || 'None'}

Provide activities that are:
- Appropriate for current mood and energy
- Feasible within time/location constraints
- Evidence-based for mental health
- Personalized to user's history

Format as JSON array with objects containing: activity, duration, reason, difficulty
      `.trim();

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a mental health AI providing personalized activity recommendations based on evidence-based practices."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 400
      });

      const recommendations = JSON.parse(response.choices[0].message.content);
      
      return {
        success: true,
        recommendations: recommendations
      };

    } catch (error) {
      console.error('Activity recommendation error:', error);
      return {
        success: false,
        recommendations: this.getDefaultRecommendations(userContext)
      };
    }
  }

  /**
   * Get default activity recommendations
   * @param {Object} userContext - User context
   * @returns {Array} Default recommendations
   */
  getDefaultRecommendations(userContext) {
    const baseRecommendations = [
      {
        activity: "Take a short walk",
        duration: 15,
        reason: "Physical activity can boost mood and energy",
        difficulty: "easy"
      },
      {
        activity: "Practice deep breathing",
        duration: 5,
        reason: "Helps reduce stress and anxiety",
        difficulty: "easy"
      },
      {
        activity: "Listen to calming music",
        duration: 10,
        reason: "Music can positively influence mood",
        difficulty: "easy"
      }
    ];

    return baseRecommendations.filter(rec => 
      rec.duration <= (userContext.availableTime || 30)
    );
  }
}

export default MoodAnalyzer;