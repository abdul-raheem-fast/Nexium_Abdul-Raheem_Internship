import dotenv from 'dotenv';
dotenv.config();
console.log('AI ROUTE ENV KEY:', process.env.OPENAI_API_KEY);
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import OpenAI from 'openai';

const router = express.Router();
const prisma = new PrismaClient();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No token provided'
    });
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'access') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token type'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { settings: true }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User account not found or deactivated'
      });
    }

    // Check if AI features are enabled
    if (!user.settings?.aiInsightsEnabled) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'AI features are disabled for this account'
      });
    }

    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
};

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array()
    });
  }
  next();
};

// Helper function to prepare mood data for AI analysis
const prepareMoodDataForAI = (entries) => {
  return entries.map(entry => ({
    date: entry.createdAt.toISOString().split('T')[0],
    mood: entry.moodScore,
    moodType: entry.moodType,
    energy: entry.energy,
    anxiety: entry.anxiety,
    stress: entry.stress,
    sleep: entry.sleep,
    activities: entry.activities,
    socialContext: entry.socialContext,
    weather: entry.weather,
    notes: entry.notes,
    tags: entry.tags
  }));
};

// AI ROUTES

/**
 * POST /api/ai/analyze-mood
 * Analyze a specific mood entry using AI
 */
router.post('/analyze-mood', authenticateToken, [
  body('moodEntryId').notEmpty().withMessage('Mood entry ID is required')
], checkValidation, async (req, res) => {
  try {
    const { moodEntryId } = req.body;

    // Get the mood entry
    const moodEntry = await prisma.moodEntry.findFirst({
      where: {
        id: moodEntryId,
        userId: req.userId
      }
    });

    if (!moodEntry) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Mood entry not found'
      });
    }

    // Prepare context for AI analysis
    const contextData = {
      mood: moodEntry.moodScore,
      moodType: moodEntry.moodType,
      energy: moodEntry.energy,
      anxiety: moodEntry.anxiety,
      stress: moodEntry.stress,
      sleep: moodEntry.sleep,
      activities: moodEntry.activities,
      socialContext: moodEntry.socialContext,
      weather: moodEntry.weather,
      notes: moodEntry.notes,
      tags: moodEntry.tags
    };

    // Create AI prompt for mood analysis
    const prompt = `
As a mental health AI assistant, analyze this mood entry and provide insights:

Mood Data:
- Overall Mood: ${contextData.mood}/10 (${contextData.moodType})
- Energy Level: ${contextData.energy}/10
- Anxiety Level: ${contextData.anxiety}/10
- Stress Level: ${contextData.stress}/10
- Sleep: ${contextData.sleep} hours
- Activities: ${contextData.activities.join(', ')}
- Social Context: ${contextData.socialContext || 'Not specified'}
- Weather: ${contextData.weather || 'Not specified'}
- Notes: ${contextData.notes || 'No notes'}
- Tags: ${contextData.tags.join(', ')}

Please provide:
1. Sentiment analysis (score from -1 to 1)
2. Key emotions detected
3. Potential triggers or contributing factors
4. Patterns or correlations you notice
5. Actionable recommendations

Respond in JSON format:
{
  "sentiment": number,
  "emotions": ["emotion1", "emotion2"],
  "triggers": ["trigger1", "trigger2"],
  "patterns": ["pattern1", "pattern2"],
  "recommendations": ["rec1", "rec2", "rec3"],
  "confidence": number
}
`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a mental health AI assistant that provides thoughtful, evidence-based insights. Always be supportive and non-judgmental."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    let analysis;
    try {
      analysis = JSON.parse(response.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to parse AI analysis'
      });
    }

    // Update mood entry with AI analysis
    const updatedEntry = await prisma.moodEntry.update({
      where: { id: moodEntryId },
      data: {
        sentiment: analysis.sentiment,
        emotions: analysis.emotions,
        triggers: analysis.triggers,
        patterns: analysis.patterns,
        confidence: analysis.confidence
      }
    });

    res.status(200).json({
      message: 'Mood analysis completed',
      analysis: analysis,
      moodEntry: updatedEntry
    });

  } catch (error) {
    console.error('AI mood analysis error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to analyze mood entry'
    });
  }
});

/**
 * POST /api/ai/generate-insights
 * Generate personalized insights based on mood patterns
 */
router.post('/generate-insights', authenticateToken, async (req, res) => {
  try {
    // Get recent mood entries (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentEntries = await prisma.moodEntry.findMany({
      where: {
        userId: req.userId,
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 30
    });

    if (recentEntries.length < 3) {
      return res.status(400).json({
        error: 'Insufficient Data',
        message: 'At least 3 mood entries are required to generate insights'
      });
    }

    // Prepare data for AI analysis
    const moodData = prepareMoodDataForAI(recentEntries);

    // Create comprehensive analysis prompt
    const prompt = `
As a mental health AI assistant, analyze this user's mood patterns over the last 30 days and generate personalized insights:

Mood Data (most recent first):
${JSON.stringify(moodData, null, 2)}

Please analyze:
1. Overall mood trends and patterns
2. Correlations between activities, sleep, and mood
3. Potential triggers for negative moods
4. Positive patterns that support good mental health
5. Areas for improvement
6. Personalized recommendations

Generate 3-5 distinct insights. For each insight, provide:
- Type (MOOD_PATTERN, ACTIVITY_CORRELATION, SLEEP_IMPACT, STRESS_TRIGGER, IMPROVEMENT_SUGGESTION, WARNING_SIGN, POSITIVE_TREND)
- Title (concise, engaging)
- Description (detailed explanation)
- Actionable recommendations
- Confidence level (0-1)

Respond in JSON format:
{
  "insights": [
    {
      "type": "INSIGHT_TYPE",
      "title": "Insight Title",
      "description": "Detailed description",
      "recommendations": ["rec1", "rec2"],
      "confidence": 0.85,
      "dataPoints": ["relevant data points"],
      "patterns": ["related patterns"]
    }
  ],
  "overallSummary": "Brief overall summary of mental health trends"
}
`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a compassionate mental health AI assistant. Provide evidence-based insights that are supportive, actionable, and non-judgmental. Focus on patterns and practical recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 2000
    });

    let analysisResult;
    try {
      analysisResult = JSON.parse(response.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI insights:', parseError);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to parse AI insights'
      });
    }

    // Store insights in database
    const createdInsights = await Promise.all(
      analysisResult.insights.map(insight => 
        prisma.insight.create({
          data: {
            userId: req.userId,
            type: insight.type,
            title: insight.title,
            description: insight.description,
            dataPoints: insight.dataPoints || [],
            confidence: insight.confidence,
            actionable: true,
            recommendations: insight.recommendations,
            relatedPatterns: insight.patterns || []
          }
        })
      )
    );

    res.status(200).json({
      message: 'Insights generated successfully',
      insights: createdInsights,
      summary: analysisResult.overallSummary,
      dataPointsAnalyzed: recentEntries.length
    });

  } catch (error) {
    console.error('AI insights generation error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to generate insights'
    });
  }
});

/**
 * POST /api/ai/analyze-journal
 * Analyze journal entry for sentiment and themes
 */
router.post('/analyze-journal', authenticateToken, [
  body('journalEntryId').notEmpty().withMessage('Journal entry ID is required')
], checkValidation, async (req, res) => {
  try {
    const { journalEntryId } = req.body;

    // Get journal entry
    const journalEntry = await prisma.journalEntry.findFirst({
      where: {
        id: journalEntryId,
        userId: req.userId
      }
    });

    if (!journalEntry) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Journal entry not found'
      });
    }

    // Create AI prompt for journal analysis
    const prompt = `
As a mental health AI assistant, analyze this journal entry:

Title: ${journalEntry.title || 'No title'}
Content: ${journalEntry.content}

Please provide:
1. Sentiment analysis (score from -1 to 1)
2. Key emotions detected
3. Main themes identified
4. Supportive insights or observations
5. Gentle suggestions if appropriate

Respond in JSON format:
{
  "sentiment": number,
  "emotions": ["emotion1", "emotion2"],
  "themes": ["theme1", "theme2"],
  "insights": ["insight1", "insight2"],
  "confidence": number
}
`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a supportive mental health AI assistant. Analyze journal entries with empathy and provide gentle, non-judgmental insights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 800
    });

    let analysis;
    try {
      analysis = JSON.parse(response.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse journal analysis:', parseError);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to parse journal analysis'
      });
    }

    // Update journal entry with AI analysis
    const updatedEntry = await prisma.journalEntry.update({
      where: { id: journalEntryId },
      data: {
        sentiment: analysis.sentiment,
        emotions: analysis.emotions,
        themes: analysis.themes,
        insights: analysis.insights
      }
    });

    res.status(200).json({
      message: 'Journal analysis completed',
      analysis: analysis,
      journalEntry: updatedEntry
    });

  } catch (error) {
    console.error('AI journal analysis error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to analyze journal entry'
    });
  }
});

/**
 * POST /api/ai/recommend-activities
 * Get AI-powered activity recommendations based on current mood
 */
router.post('/recommend-activities', authenticateToken, [
  body('currentMood').isInt({ min: 1, max: 10 }).withMessage('Current mood must be between 1 and 10'),
  body('moodType').isIn(['TERRIBLE', 'BAD', 'OKAY', 'GOOD', 'GREAT', 'EXCITED', 'CALM', 'ANXIOUS', 'SAD', 'ANGRY', 'CONFUSED', 'GRATEFUL', 'HOPEFUL']).withMessage('Invalid mood type'),
  body('availableTime').optional().isInt({ min: 5, max: 180 }).withMessage('Available time must be between 5 and 180 minutes'),
  body('location').optional().isIn(['home', 'work', 'outdoors', 'gym', 'social']).withMessage('Invalid location'),
  body('energy').optional().isInt({ min: 1, max: 10 }).withMessage('Energy must be between 1 and 10')
], checkValidation, async (req, res) => {
  try {
    const { currentMood, moodType, availableTime = 30, location = 'home', energy = 5 } = req.body;

    // Get user's past activities and their mood impact
    const pastActivities = await prisma.activity.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // Create recommendation prompt
    const prompt = `
As a mental health AI assistant, recommend activities for someone with:

Current State:
- Mood: ${currentMood}/10 (${moodType})
- Energy Level: ${energy}/10
- Available Time: ${availableTime} minutes
- Location: ${location}

Past Activities (if any):
${pastActivities.length > 0 ? JSON.stringify(pastActivities.slice(0, 10), null, 2) : 'No past activities recorded'}

Please recommend 5-7 activities that would be beneficial for this person's current state. For each activity:
- Consider their mood, energy, time, and location constraints
- Focus on evidence-based activities for mental health
- Include a mix of physical, mental, and social activities when appropriate

Respond in JSON format:
{
  "recommendations": [
    {
      "name": "Activity Name",
      "category": "EXERCISE|SOCIAL|SELF_CARE|MEDITATION|CREATIVE|OTHER",
      "duration": number_in_minutes,
      "intensity": "LOW|MODERATE|HIGH",
      "description": "Brief description",
      "benefits": ["benefit1", "benefit2"],
      "instructions": "How to do this activity",
      "moodBoost": number_1_to_5,
      "energyRequired": number_1_to_10
    }
  ],
  "personalizedNote": "Brief personalized message about why these activities were chosen"
}
`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a mental health AI assistant specializing in activity recommendations. Provide evidence-based, practical activities that promote wellbeing."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 1500
    });

    let recommendations;
    try {
      recommendations = JSON.parse(response.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse activity recommendations:', parseError);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to parse activity recommendations'
      });
    }

    res.status(200).json({
      message: 'Activity recommendations generated',
      currentState: {
        mood: currentMood,
        moodType,
        energy,
        availableTime,
        location
      },
      recommendations: recommendations.recommendations,
      personalizedNote: recommendations.personalizedNote
    });

  } catch (error) {
    console.error('AI activity recommendations error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to generate activity recommendations'
    });
  }
});

/**
 * POST /api/ai/crisis-assessment
 * AI-powered crisis risk assessment
 */
router.post('/crisis-assessment', authenticateToken, [
  body('responses').isObject().withMessage('Crisis assessment responses required'),
  body('currentMood').isInt({ min: 1, max: 10 }).withMessage('Current mood required'),
  body('recentEntries').optional().isArray().withMessage('Recent entries must be an array')
], checkValidation, async (req, res) => {
  try {
    const { responses, currentMood, recentEntries = [] } = req.body;

    // This is a sensitive feature - implement with extreme care
    // In production, this would likely require human oversight

    const prompt = `
As a mental health crisis assessment AI, evaluate the risk level based on:

Current Mood: ${currentMood}/10
Assessment Responses: ${JSON.stringify(responses)}
Recent Mood Patterns: ${JSON.stringify(recentEntries.slice(0, 5))}

Provide a risk assessment with:
1. Risk level (LOW, MODERATE, HIGH, SEVERE)
2. Key concerns identified
3. Immediate recommendations
4. Whether professional help is strongly recommended

IMPORTANT: Err on the side of caution. When in doubt, recommend professional help.

Respond in JSON format:
{
  "riskLevel": "LOW|MODERATE|HIGH|SEVERE",
  "concerns": ["concern1", "concern2"],
  "immediateActions": ["action1", "action2"],
  "professionalHelpRecommended": boolean,
  "supportResources": ["resource1", "resource2"],
  "confidence": number,
  "urgency": "LOW|MODERATE|HIGH|EMERGENCY"
}
`;

    // Call OpenAI with careful prompting
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a mental health crisis assessment AI. Always prioritize safety and err on the side of recommending professional help. Never provide therapy or medical advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1, // Very low temperature for consistency
      max_tokens: 1000
    });

    let assessment;
    try {
      assessment = JSON.parse(response.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse crisis assessment:', parseError);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to parse crisis assessment'
      });
    }

    // Log crisis assessments for monitoring
    console.log(`Crisis assessment for user ${req.userId}: ${assessment.riskLevel}`);

    // If high risk, create alert and potentially notify support team
    if (['HIGH', 'SEVERE'].includes(assessment.riskLevel)) {
      await prisma.notification.create({
        data: {
          userId: req.userId,
          type: 'CRISIS_ALERT',
          title: 'Crisis Support Resources',
          message: 'Based on your responses, we recommend reaching out to a mental health professional. Immediate support is available.',
          data: { assessment }
        }
      });
    }

    res.status(200).json({
      message: 'Crisis assessment completed',
      assessment: assessment,
      emergencyContacts: [
        { name: 'National Suicide Prevention Lifeline', phone: '988', available: '24/7' },
        { name: 'Crisis Text Line', contact: 'Text HOME to 741741', available: '24/7' }
      ]
    });

  } catch (error) {
    console.error('Crisis assessment error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to complete crisis assessment'
    });
  }
});

export default router; 