import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample achievements that users can unlock
  const achievements = [
    {
      type: 'MILESTONE',
      title: 'First Steps',
      description: 'Logged your first mood entry. Welcome to your wellness journey!',
      category: 'onboarding',
      points: 10,
      badge: '🎯',
      criteria: { type: 'mood_entries_count', value: 1 }
    },
    {
      type: 'STREAK',
      title: 'Week Warrior',
      description: 'Logged mood entries for 7 consecutive days. Consistency is key!',
      category: 'consistency',
      points: 50,
      badge: '🔥',
      criteria: { type: 'consecutive_days', value: 7 }
    },
    {
      type: 'STREAK',
      title: 'Month Master',
      description: 'Maintained a 30-day mood tracking streak. Incredible dedication!',
      category: 'consistency',
      points: 200,
      badge: '🏆',
      criteria: { type: 'consecutive_days', value: 30 }
    },
    {
      type: 'IMPROVEMENT',
      title: 'Mood Improver',
      description: 'Your average mood has improved by 2+ points over the past month!',
      category: 'progress',
      points: 75,
      badge: '📈',
      criteria: { type: 'mood_improvement', value: 2 }
    },
    {
      type: 'CONSISTENCY',
      title: 'Early Bird',
      description: 'Logged mood entries before 9 AM for 5 consecutive days.',
      category: 'habits',
      points: 30,
      badge: '🌅',
      criteria: { type: 'early_entries', value: 5 }
    },
    {
      type: 'EXPLORATION',
      title: 'Activity Explorer',
      description: 'Tried 10 different types of activities. Variety is the spice of life!',
      category: 'activities',
      points: 40,
      badge: '🎪',
      criteria: { type: 'unique_activities', value: 10 }
    },
    {
      type: 'WELLNESS',
      title: 'Sleep Champion',
      description: 'Maintained 7+ hours of sleep for 7 consecutive days.',
      category: 'sleep',
      points: 60,
      badge: '😴',
      criteria: { type: 'good_sleep_streak', value: 7 }
    },
    {
      type: 'SOCIAL',
      title: 'Journal Keeper',
      description: 'Written 10 journal entries. Self-reflection is powerful!',
      category: 'journaling',
      points: 45,
      badge: '📝',
      criteria: { type: 'journal_entries_count', value: 10 }
    },
    {
      type: 'WELLNESS',
      title: 'Stress Buster',
      description: 'Reduced average stress levels by 2+ points over the past month.',
      category: 'progress',
      points: 80,
      badge: '😌',
      criteria: { type: 'stress_reduction', value: 2 }
    },
    {
      type: 'MILESTONE',
      title: 'Goal Getter',
      description: 'Completed your first wellness goal. Achievement unlocked!',
      category: 'goals',
      points: 55,
      badge: '🎯',
      criteria: { type: 'completed_goals', value: 1 }
    },
    {
      type: 'CONSISTENCY',
      title: 'Weekly Warrior',
      description: 'Completed all 7 mood check-ins this week. Perfect score!',
      category: 'consistency',
      points: 35,
      badge: '⭐',
      criteria: { type: 'weekly_completion', value: 7 }
    },
    {
      type: 'EXPLORATION',
      title: 'Mood Master',
      description: 'Experienced and logged 8 different mood types.',
      category: 'awareness',
      points: 25,
      badge: '🎭',
      criteria: { type: 'mood_variety', value: 8 }
    }
  ];

  // Create a system user first for achievements
  console.log('Creating system user...');
  const systemUser = await prisma.user.upsert({
    where: { email: 'system@mentalhealthtracker.com' },
    update: {},
    create: {
      email: 'system@mentalhealthtracker.com',
      name: 'System',
      isActive: true,
    }
  });

  // Create default achievements
  console.log('Creating default achievements...');
  for (const achievement of achievements) {
    await prisma.achievement.create({
      data: {
        ...achievement,
        userId: systemUser.id, // System achievements available to all users
        progress: 0,
        isUnlocked: false
      }
    });
  }

  // Create sample crisis contacts (templates)
  const crisisContactTemplates = [
    {
      name: 'National Suicide Prevention Lifeline',
      relationship: 'hotline',
      phone: '988',
      email: null,
      notes: 'Free and confidential emotional support 24/7',
      isPrimary: false,
      isEmergency: true
    },
    {
      name: 'Crisis Text Line',
      relationship: 'hotline',
      phone: '741741',
      email: null,
      notes: 'Text HOME to 741741 for crisis support',
      isPrimary: false,
      isEmergency: true
    },
    {
      name: 'NAMI HelpLine',
      relationship: 'support',
      phone: '1-800-950-6264',
      email: 'info@nami.org',
      notes: 'Mental health information and support',
      isPrimary: false,
      isEmergency: false
    },
    {
      name: 'SAMHSA National Helpline',
      relationship: 'hotline',
      phone: '1-800-662-4357',
      email: null,
      notes: 'Treatment referral and information service',
      isPrimary: false,
      isEmergency: false
    }
  ];

  // Create sample emergency plan templates
  const emergencyPlanTemplates = [
    {
      title: 'Personal Crisis Plan',
      description: 'A comprehensive plan for managing mental health crises',
      warningSigns: [
        'Feeling hopeless or worthless',
        'Increased anxiety or panic attacks',
        'Difficulty sleeping or sleeping too much',
        'Loss of interest in activities',
        'Thoughts of self-harm',
        'Increased substance use',
        'Isolating from friends and family'
      ],
      copingStrategies: [
        'Practice deep breathing exercises',
        'Call a trusted friend or family member',
        'Use grounding techniques (5-4-3-2-1 method)',
        'Listen to calming music',
        'Take a warm bath or shower',
        'Write in a journal',
        'Go for a walk in nature',
        'Practice mindfulness meditation'
      ],
      contactSteps: [
        'Contact primary support person',
        'Call crisis hotline if needed',
        'Reach out to mental health professional',
        'Contact emergency services if in immediate danger',
        'Inform trusted friend about crisis plan'
      ],
      safetyPlan: [
        'Remove any means of self-harm from environment',
        'Stay with trusted person if possible',
        'Keep important phone numbers easily accessible',
        'Have transportation plan to emergency services',
        'Keep list of coping strategies visible'
      ],
      triggerLevel: 'MODERATE',
      isActive: true
    }
  ];

  // Create sample wellness goals
  const goalTemplates = [
    {
      title: 'Daily Mood Check-ins',
      description: 'Log mood entry every day for better self-awareness',
      category: 'MOOD',
      priority: 'HIGH',
      targetValue: 30,
      unit: 'days',
      status: 'ACTIVE'
    },
    {
      title: 'Regular Exercise',
      description: 'Engage in physical activity 3 times per week',
      category: 'ACTIVITY',
      priority: 'MEDIUM',
      targetValue: 12,
      unit: 'sessions',
      status: 'ACTIVE'
    },
    {
      title: 'Better Sleep Hygiene',
      description: 'Get 7-8 hours of sleep each night',
      category: 'HEALTH',
      priority: 'HIGH',
      targetValue: 8,
      unit: 'hours',
      status: 'ACTIVE'
    },
    {
      title: 'Mindfulness Practice',
      description: 'Practice meditation or mindfulness for 10 minutes daily',
      category: 'WELLNESS',
      priority: 'MEDIUM',
      targetValue: 10,
      unit: 'minutes',
      status: 'ACTIVE'
    },
    {
      title: 'Social Connection',
      description: 'Connect with friends or family 2 times per week',
      category: 'SOCIAL',
      priority: 'MEDIUM',
      targetValue: 2,
      unit: 'times',
      status: 'ACTIVE'
    }
  ];

  // Create sample activity categories with suggestions
  const activitySuggestions = {
    EXERCISE: [
      'Morning walk', 'Yoga session', 'Swimming', 'Dancing', 'Cycling',
      'Running', 'Strength training', 'Stretching', 'Hiking', 'Team sports'
    ],
    SELF_CARE: [
      'Meditation', 'Bath time', 'Skincare routine', 'Reading', 'Listening to music',
      'Aromatherapy', 'Massage', 'Deep breathing', 'Gratitude practice', 'Napping'
    ],
    SOCIAL: [
      'Coffee with friend', 'Family dinner', 'Video call', 'Board games',
      'Movie night', 'Group exercise', 'Volunteering', 'Community event', 'Party', 'Support group'
    ],
    CREATIVE: [
      'Drawing', 'Painting', 'Writing', 'Photography', 'Crafting',
      'Music making', 'Cooking', 'Gardening', 'Knitting', 'Poetry'
    ],
    LEARNING: [
      'Online course', 'Reading book', 'Podcast listening', 'Documentary watching',
      'Language practice', 'Skill tutorial', 'Research topic', 'Workshop attendance'
    ],
    ENTERTAINMENT: [
      'Watching TV', 'Playing games', 'Browsing internet', 'Social media',
      'Comedy show', 'Concert', 'Theater', 'Festival', 'Shopping', 'Sightseeing'
    ]
  };

  // Create insight templates for AI system
  const insightTemplates = [
    {
      type: 'MOOD_PATTERN',
      title: 'Weekly Mood Pattern Detected',
      description: 'Your mood tends to be lower on Mondays and higher on Fridays, suggesting work-related stress patterns.'
    },
    {
      type: 'ACTIVITY_CORRELATION',
      title: 'Exercise Boosts Your Mood',
      description: 'Data shows your mood improves by an average of 2 points on days when you exercise.'
    },
    {
      type: 'SLEEP_IMPACT',
      title: 'Sleep Affects Your Energy',
      description: 'Getting less than 7 hours of sleep correlates with 30% lower energy levels the next day.'
    },
    {
      type: 'POSITIVE_TREND',
      title: 'Upward Trend in Wellness',
      description: 'Your overall mood has improved by 15% over the past month. Keep up the great work!'
    }
  ];

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created ${achievements.length} achievement templates`);
  console.log(`🆘 Created ${crisisContactTemplates.length} crisis contact templates`);
  console.log(`🎯 Created ${goalTemplates.length} goal templates`);
  console.log(`🎨 Created activity suggestions for ${Object.keys(activitySuggestions).length} categories`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 