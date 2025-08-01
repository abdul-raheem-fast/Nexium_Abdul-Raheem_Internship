import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  moodScore: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  moodType: {
    type: String,
    enum: ['GREAT', 'GOOD', 'OKAY', 'BAD', 'TERRIBLE', 'EXCITED', 'CALM', 'ANXIOUS', 'SAD', 'ANGRY', 'CONFUSED', 'GRATEFUL', 'HOPEFUL'],
    required: true,
  },
  energy: {
    type: Number,
    min: 1,
    max: 10,
  },
  anxiety: {
    type: Number,
    min: 1,
    max: 10,
  },
  stress: {
    type: Number,
    min: 1,
    max: 10,
  },
  sleep: {
    type: Number,
    min: 0,
    max: 24,
  },
  activities: [{
    type: String,
  }],
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const MoodEntry = mongoose.models.MoodEntry || mongoose.model('MoodEntry', moodEntrySchema) as any; 