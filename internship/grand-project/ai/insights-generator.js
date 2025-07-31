/**
 * AI Insights Generator
 * Generates personalized mental health insights and recommendations
 */

import OpenAI from 'openai';

class InsightsGenerator {
  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey: apiKey
    });
  }

  /**
   * Generate comprehensive insights from user data
   * @param {Object} userData - User's mood and activity data
   * @returns {Object} Generated insights
   */
  async generateInsights(userData) {
    try {
      const prompt = this.buildInsightsPrompt(userData);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a compassionate mental health AI that provides personalized insights based on user data. Focus on patterns, positive reinforcement, and actionable recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      const insights = this.parseInsightsResponse(response.choices[0].message.content);
      
      return {
        success: true,
        insights: {
          summary: insights.summary || '',
          patterns: insights.patterns || [],
          recommendations: insights.recommendations || [],
          achievements: insights.achievements || [],
          areasForGrowth: insights.areasForGrowth || [],
          motivationalMessage: insights.motivationalMessage || ''
        }
      };

    } catch (error) {
      console.error('Insights generation error:', error);
      return {
        success: false,
        insights: this.getDefaultInsights()
      };
    }
  }

  /**
   * Build comprehensive insights prompt
   * @param {Object} userData - User data for analysis
   * @returns {string} Insights prompt
   */
  buildInsightsPrompt(userData) {
    const recentMoods = userData.moodEntries?.slice(-7) || [];
    const avgMood = recentMoods.length > 0 
      ? recentMoods.reduce((sum, entry) => sum + entry.moodScore, 0) / recentMoods.length 
      : 0;

    return `
Analyze this user's mental health data and provide personalized insights:

RECENT MOOD DATA (Last 7 entries):
${recentMoods.map(entry => `
- Date: ${entry.date}
- Mood: ${entry.moodScore}/10 (${entry.moodType})
- Energy: ${entry.energy}/10
- Activities: ${entry.activities?.join(', ') || 'None'}
- Notes: "${entry.notes || 'No notes'}"
`).join('')}

JOURNAL ENTRIES:
${userData.journalEntries?.slice(-3).map(entry => `
- Title: "${entry.title}"
- Content: "${entry.content?.substring(0, 200)}..."
- Mood: ${entry.mood}
`).join('') || 'No recent journal entries'}

USER PREFERENCES:
- Preferred activities: ${userData.preferences?.activities?.join(', ') || 'Not specified'}
- Goals: ${userData.goals?.join(', ') || 'Not specified'}

STATISTICS:
- Average mood (last 7 days): ${avgMood.toFixed(1)}/10
- Total entries: ${userData.totalEntries || 0}
- Tracking streak: ${userData.streak || 0} days

Please provide comprehensive insights in JSON format with:
1. summary: Brief overview of mental health trends
2. patterns: Array of identified patterns with descriptions
3. recommendations: 4-5 personalized action items
4. achievements: Positive accomplishments to celebrate
5. areasForGrowth: Gentle suggestions for improvement
6. motivationalMessage: Encouraging message for continued progress

Focus on being supportive, evidence-based, and actionable.
    `.trim();
  }

  /**
   * Parse AI insights response
   * @param {string} response - AI response text
   * @returns {Object} Parsed insights
   */
  parseInsightsResponse(response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return this.fallbackInsightsParsing(response);
    } catch (error) {
      console.error('Insights parsing error:', error);
      return this.getDefaultInsights();
    }
  }

  /**
   * Fallback parsing for insights
   * @param {string} response - AI response
   * @returns {Object} Fallback insights
   */
  fallbackInsightsParsing(response) {
    return {
      summary: response.substring(0, 300) + '...',
      patterns: ['General wellness trends observed'],
      recommendations: [
        'Continue regular mood tracking',
        'Maintain healthy sleep schedule',
        'Engage in physical activity',
        'Practice mindfulness'
      ],
      achievements: ['Consistent tracking efforts'],
      areasForGrowth: ['Continue building healthy habits'],
      motivationalMessage: 'Keep up the great work on your mental health journey!'
    };
  }

  /**
   * Get default insights for error cases
   * @returns {Object} Default insights
   */
  getDefaultInsights() {
    return {
      summary: "Your mental health journey is unique and valuable. Continue tracking your progress and celebrating small wins along the way.",
      patterns: [
        "Regular mood tracking shows commitment to self-awareness",
        "Consistency in logging entries demonstrates dedication to mental health"
      ],
      recommendations: [
        "Continue your daily mood tracking routine",
        "Try incorporating 30 minutes of physical activity into your day",
        "Practice gratitude by noting three positive things each day",
        "Maintain a consistent sleep schedule for better mood regulation",
        "Consider mindfulness or meditation practices"
      ],
      achievements: [
        "Taking proactive steps toward mental health awareness",
        "Committing to regular self-reflection and tracking"
      ],
      areasForGrowth: [
        "Explore new coping strategies that work for you",
        "Consider connecting with supportive friends or family",
        "Focus on building sustainable healthy habits"
      ],
      motivationalMessage: "Every step you take toward understanding your mental health is meaningful. You're building valuable self-awareness that will serve you well. Keep going! 🌟"
    };
  }

  /**
   * Generate crisis assessment and support recommendations
   * @param {Object} riskIndicators - Risk assessment data
   * @returns {Object} Crisis assessment results
   */
  async assessCrisisRisk(riskIndicators) {
    try {
      const prompt = `
Assess mental health crisis risk based on these indicators:

Recent Mood Scores: ${riskIndicators.recentMoods?.join(', ') || 'Not available'}
Concerning Keywords: ${riskIndicators.keywords?.join(', ') || 'None detected'}
Sleep Pattern: ${riskIndicators.sleepPattern || 'Normal'}
Social Isolation: ${riskIndicators.socialIsolation ? 'Yes' : 'No'}
Recent Stressors: ${riskIndicators.stressors?.join(', ') || 'None reported'}

Provide assessment in JSON format:
- riskLevel: "low", "medium", or "high"
- concerns: Array of specific concerns
- immediateActions: Array of immediate steps to take
- resources: Array of helpful resources
- followUpRecommendations: Array of follow-up actions
- supportMessage: Compassionate message

Be professional, caring, and prioritize user safety.
      `.trim();

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a mental health crisis assessment AI. Prioritize user safety and provide appropriate resources and support."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent crisis assessment
        max_tokens: 600
      });

      const assessment = JSON.parse(response.choices[0].message.content);
      
      return {
        success: true,
        assessment: assessment
      };

    } catch (error) {
      console.error('Crisis assessment error:', error);
      return {
        success: false,
        assessment: this.getDefaultCrisisAssessment()
      };
    }
  }

  /**
   * Get default crisis assessment
   * @returns {Object} Default crisis assessment
   */
  getDefaultCrisisAssessment() {
    return {
      riskLevel: "low",
      concerns: ["General mental health monitoring needed"],
      immediateActions: [
        "Continue regular self-care practices",
        "Reach out to trusted friends or family",
        "Maintain healthy routines"
      ],
      resources: [
        "National Suicide Prevention Lifeline: 988",
        "Crisis Text Line: Text HOME to 741741",
        "Local mental health services",
        "Emergency services: 911 if in immediate danger"
      ],
      followUpRecommendations: [
        "Schedule regular check-ins with mental health professional",
        "Continue mood tracking",
        "Build support network"
      ],
      supportMessage: "Your mental health matters. If you're struggling, please reach out for support. You don't have to face challenges alone."
    };
  }
}

export default InsightsGenerator;