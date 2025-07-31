import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create default analytics data for new users
export default async function createDefaultAnalytics(userId, email) {
  try {
    console.log('✅ Creating default analytics for user:', userId, email);
    
    // First, verify the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.log(`⚠️ User with ID ${userId} not found, skipping default analytics creation`);
      return null;
    }
    
    console.log(`✅ User verified: ${user.email}`);
    
    // Create default mood entries for the past 7 days
    const defaultMoodEntries = [
      {
        userId: userId,
        moodScore: 8,
        moodType: 'GOOD',
        energy: 7,
        anxiety: 3,
        stress: 4,
        sleep: 8,
        activities: ['Exercise', 'Meditation'],
        notes: 'Great workout session, feeling energized!',
        tags: ['productive', 'active'],
        entryMethod: 'MANUAL',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
      },
      {
        userId: userId,
        moodScore: 7,
        moodType: 'OKAY',
        energy: 6,
        anxiety: 4,
        stress: 5,
        sleep: 7,
        activities: ['Reading', 'Social'],
        notes: 'Had a nice chat with friends, feeling social',
        tags: ['social', 'relaxed'],
        entryMethod: 'MANUAL',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        userId: userId,
        moodScore: 9,
        moodType: 'GREAT', // Changed from 'EXCELLENT' to 'GREAT'
        energy: 9,
        anxiety: 2,
        stress: 2,
        sleep: 8,
        activities: ['Exercise', 'Work'],
        notes: 'Productive day at work, completed major project',
        tags: ['productive', 'accomplished'],
        entryMethod: 'MANUAL',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
      },
      {
        userId: userId,
        moodScore: 6,
        moodType: 'OKAY',
        energy: 5,
        anxiety: 5,
        stress: 6,
        sleep: 6,
        activities: ['Social'],
        notes: 'Bit tired but good day overall',
        tags: ['tired', 'social'],
        entryMethod: 'MANUAL',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        userId: userId,
        moodScore: 8,
        moodType: 'GOOD',
        energy: 7,
        anxiety: 3,
        stress: 4,
        sleep: 7,
        activities: ['Exercise', 'Meditation', 'Reading'],
        notes: 'Morning routine was perfect',
        tags: ['routine', 'balanced'],
        entryMethod: 'MANUAL',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        userId: userId,
        moodScore: 7,
        moodType: 'CALM',
        energy: 6,
        anxiety: 2,
        stress: 3,
        sleep: 8,
        activities: ['Meditation', 'Reading'],
        notes: 'Peaceful evening, feeling calm and centered',
        tags: ['calm', 'peaceful'],
        entryMethod: 'MANUAL',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        userId: userId,
        moodScore: 8,
        moodType: 'HOPEFUL',
        energy: 8,
        anxiety: 2,
        stress: 3,
        sleep: 7,
        activities: ['Exercise', 'Social'],
        notes: 'Feeling optimistic about the new week ahead',
        tags: ['hopeful', 'optimistic'],
        entryMethod: 'MANUAL',
        createdAt: new Date() // Today
      }
    ];

    // Create default mood entries
    for (const entry of defaultMoodEntries) {
      try {
        await prisma.moodEntry.create({
          data: entry
        });
        console.log(`✅ Created default mood entry for ${entry.createdAt.toDateString()}`);
      } catch (error) {
        console.log(`⚠️ Could not create mood entry for ${entry.createdAt.toDateString()}:`, error.message);
      }
    }

    // Create default analytics data
    const defaultAnalytics = {
      userId: userId,
      overview: {
        totalMoodEntries: 7,
        averageMood: 7.6,
        currentStreak: 7,
        improvement: '+12%'
      },
      recentMood: {
        trend: 'improving',
        average: 7.6,
        entries: [
          { date: '2025-07-25', mood: 8 },
          { date: '2025-07-26', mood: 7 },
          { date: '2025-07-27', mood: 9 },
          { date: '2025-07-28', mood: 6 },
          { date: '2025-07-29', mood: 8 },
          { date: '2025-07-30', mood: 7 },
          { date: '2025-07-31', mood: 8 }
        ]
      },
      recentEntries: [
        {
          id: 1,
          moodScore: 8,
          moodType: 'HOPEFUL',
          createdAt: '2025-07-31T10:00:00Z',
          activities: ['Exercise', 'Social'],
          notes: 'Feeling optimistic about the new week ahead'
        },
        {
          id: 2,
          moodScore: 7,
          moodType: 'CALM',
          createdAt: '2025-07-30T15:30:00Z',
          activities: ['Meditation', 'Reading'],
          notes: 'Peaceful evening, feeling calm and centered'
        },
        {
          id: 3,
          moodScore: 9,
          moodType: 'GREAT', // Changed from 'EXCELLENT' to 'GREAT'
          createdAt: '2025-07-29T09:15:00Z',
          activities: ['Exercise', 'Work'],
          notes: 'Productive day at work, completed major project'
        }
      ],
      activityImpact: [
        { activity: 'Exercise', impact: 8.5 },
        { activity: 'Meditation', impact: 7.8 },
        { activity: 'Social', impact: 7.2 },
        { activity: 'Reading', impact: 6.8 },
        { activity: 'Work', impact: 5.1 }
      ]
    };

    console.log('✅ Default analytics and mood entries created for user:', userId);
    return defaultAnalytics;
  } catch (error) {
    console.error('❌ Error creating default analytics:', error);
    throw error;
  }
} 